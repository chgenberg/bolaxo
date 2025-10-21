'use client'

import { useRouter } from 'next/navigation'
import { useFormStore } from '@/store/formStore'
import { useForm } from 'react-hook-form'
import StepWizardLayout from '@/components/StepWizardLayout'
import FormField from '@/components/FormField'
import { Building, Users, Calendar, TrendingUp } from 'lucide-react'

export default function Step1StartPage() {
  const router = useRouter()
  const { formData, updateField, saveToLocalStorage, lastSaved } = useFormStore()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Record<string, any>>({
    defaultValues: formData,
  })

  const onSubmit = (data: any) => {
    Object.keys(data).forEach(key => {
      updateField(key, data[key])
    })
    saveToLocalStorage()
    router.push('/salja/affarsdata')
  }

  const categories = [
    { value: 'e-handel', label: 'E-handel', icon: TrendingUp },
    { value: 'teknologi', label: 'Teknologi', icon: Building },
    { value: 'tjanster', label: 'Tjänster', icon: Users },
    { value: 'tillverkning', label: 'Tillverkning', icon: Building },
    { value: 'annat', label: 'Annat', icon: Calendar },
  ]

  return (
    <StepWizardLayout
      currentStep={1}
      totalSteps={7}
      onBack={() => router.push('/salja')}
      onNext={handleSubmit(onSubmit)}
      lastSaved={lastSaved}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-3 mb-3">Grundläggande information</h1>
          <p className="text-text-gray">
            Börja med att berätta lite om ditt företag. All information behandlas konfidentiellt.
          </p>
        </div>

        {/* Form Content */}
        <div className="space-y-6">
          {/* Company Name */}
          <FormField
            label="Företagsnamn"
            placeholder="AB Exempel"
            tooltip="Detta visas inte publikt om du väljer att vara anonym"
            {...register('companyName', { required: 'Företagsnamn krävs' })}
            error={(errors as any).companyName?.message as string | undefined}
          />

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-dark">
              Bransch <span className="text-error">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <label
                    key={category.value}
                    className={`
                      relative flex items-center p-4 rounded-card border-2 cursor-pointer
                      transition-all duration-200 hover:shadow-soft
                      ${formData.category === category.value 
                        ? 'border-primary-blue bg-light-blue/10' 
                        : 'border-gray-200 hover:border-primary-blue/30'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      value={category.value}
                      {...register('category', { required: 'Välj en bransch' })}
                      className="sr-only"
                    />
                    <Icon className={`w-5 h-5 mr-3 ${
                      formData.category === category.value 
                        ? 'text-primary-blue' 
                        : 'text-text-gray'
                    }`} />
                    <span className={`font-medium ${
                      formData.category === category.value 
                        ? 'text-primary-blue' 
                        : 'text-text-dark'
                    }`}>
                      {category.label}
                    </span>
                  </label>
                )
              })}
            </div>
            {errors.category && (
              <p className="text-sm text-error mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* Founded Year */}
          <FormField
            label="Grundat år"
            type="number"
            placeholder="2015"
            {...register('foundedYear', { 
              required: 'Grundat år krävs',
              min: { value: 1900, message: 'Ogiltigt årtal' },
              max: { value: new Date().getFullYear(), message: 'Kan inte vara i framtiden' }
            })}
            error={errors.foundedYear?.message}
          />

          {/* Number of Employees */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-dark">
              Antal anställda <span className="text-error">*</span>
            </label>
            <select
              {...register('employees', { required: 'Välj antal anställda' })}
              className="select-field"
            >
              <option value="">Välj antal</option>
              <option value="1-5">1-5 anställda</option>
              <option value="6-10">6-10 anställda</option>
              <option value="11-25">11-25 anställda</option>
              <option value="26-50">26-50 anställda</option>
              <option value="51-100">51-100 anställda</option>
              <option value="100+">Över 100 anställda</option>
            </select>
            {errors.employees && (
              <p className="text-sm text-error mt-1">{errors.employees.message}</p>
            )}
          </div>

          {/* Location */}
          <FormField
            label="Huvudort"
            placeholder="Stockholm"
            {...register('location', { required: 'Ort krävs' })}
            error={errors.location?.message}
          />

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-dark">
              Kort beskrivning av verksamheten <span className="text-error">*</span>
            </label>
            <textarea
              {...register('description', { 
                required: 'Beskrivning krävs',
                minLength: { value: 50, message: 'Minst 50 tecken krävs' },
                maxLength: { value: 500, message: 'Max 500 tecken' }
              })}
              rows={4}
              className="input-field resize-none"
              placeholder="Beskriv kort vad företaget gör, era huvudsakliga produkter/tjänster och målgrupp..."
            />
            <div className="flex justify-between text-sm">
              <span className="text-text-gray">
                {formData.description?.length || 0} / 500 tecken
              </span>
              {errors.description && (
                <span className="text-error">{errors.description.message}</span>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex justify-between pt-8 border-t border-gray-100">
          <button
            type="button"
            onClick={() => router.push('/salja')}
            className="btn-secondary"
          >
            Tillbaka
          </button>
          <button type="submit" className="btn-primary">
            Fortsätt till affärsdata
          </button>
        </div>
      </form>
    </StepWizardLayout>
  )
}