import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs'
import * as path from 'path'
import { gzip } from 'zlib'
import { promisify as p } from 'util'

const execAsync = promisify(exec)
const gzipAsync = p(gzip)

const BACKUP_DIR = process.env.BACKUP_DIR || './backups'
const RETENTION_DAYS = parseInt(process.env.RETENTION_DAYS || '30')
const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL environment variable is not set')
  process.exit(1)
}

async function createBackup() {
  try {
    // Create backup directory if it doesn't exist
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true })
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const backupFile = path.join(BACKUP_DIR, `backup_${timestamp}.sql`)
    const compressedFile = `${backupFile}.gz`

    console.log('🔄 Starting database backup...')
    console.log(`📁 Backup file: ${compressedFile}`)

    // Create backup using pg_dump
    const { stdout, stderr } = await execAsync(
      `pg_dump "${DATABASE_URL}" > "${backupFile}"`
    )

    if (stderr && !stderr.includes('NOTICE')) {
      throw new Error(stderr)
    }

    // Compress backup
    const backupData = fs.readFileSync(backupFile)
    const compressed = await gzipAsync(backupData)
    fs.writeFileSync(compressedFile, compressed)
    fs.unlinkSync(backupFile) // Remove uncompressed file

    const stats = fs.statSync(compressedFile)
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2)

    console.log(`✅ Backup created successfully`)
    console.log(`📦 File: ${compressedFile}`)
    console.log(`📊 Size: ${sizeMB} MB`)

    // Clean up old backups
    await cleanupOldBackups()

    // Upload to S3 if configured
    if (process.env.AWS_S3_BACKUP_BUCKET) {
      await uploadToS3(compressedFile)
    }

    return compressedFile
  } catch (error) {
    console.error('❌ Backup failed:', error)
    throw error
  }
}

async function uploadToS3(backupFile: string) {
  try {
    // Dynamic import to avoid requiring AWS SDK if not needed
    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3')

    if (!process.env.AWS_S3_BACKUP_BUCKET) return

    const s3Client = new S3Client({
      region: process.env.AWS_S3_REGION || 'eu-west-1',
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
      },
    })

    const fileContent = fs.readFileSync(backupFile)
    const fileName = path.basename(backupFile)

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BACKUP_BUCKET,
        Key: `backups/${fileName}`,
        Body: fileContent,
        ContentType: 'application/gzip',
      })
    )

    console.log(`✅ Uploaded to S3: ${fileName}`)
  } catch (error) {
    console.error('⚠️  Error uploading to S3:', error)
    // Don't fail the backup if S3 upload fails
  }
}

async function cleanupOldBackups() {
  try {
    const files = fs.readdirSync(BACKUP_DIR)
    const now = Date.now()
    const retentionMs = RETENTION_DAYS * 24 * 60 * 60 * 1000

    let deletedCount = 0
    for (const file of files) {
      if (file.startsWith('backup_') && file.endsWith('.sql.gz')) {
        const filePath = path.join(BACKUP_DIR, file)
        const stats = fs.statSync(filePath)
        const age = now - stats.mtimeMs

        if (age > retentionMs) {
          fs.unlinkSync(filePath)
          deletedCount++
          console.log(`🗑️  Deleted old backup: ${file}`)
        }
      }
    }

    if (deletedCount > 0) {
      console.log(`✅ Cleaned up ${deletedCount} old backup(s)`)
    }
  } catch (error) {
    console.error('⚠️  Error cleaning up old backups:', error)
  }
}

// Run backup
createBackup()
  .then((backupFile) => {
    console.log(`\n✅ Backup completed: ${backupFile}`)
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Backup failed:', error)
    process.exit(1)
  })
})
