"use client"
import React, { useMemo, useState } from 'react'
import Modal from './Modal'

import { categories } from '../navbar/Categories'
import useRentModal from '@/app/hooks/useRentModal'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import Heading from '../Heading'
import CategoryInput from '../inputs/CategoryInput'
import CountrySelect from '../inputs/CountrySelect'
import dynamic from 'next/dynamic'
import Counter from '../inputs/Counter'
import ImageUpload from '../inputs/ImageUpload'
import Input from '../inputs/Input'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5
}

const RentModal = () => {
  const rentModal = useRentModal();
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(STEPS.CATEGORY)

  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: {
      errors,
    },
    reset

  } = useForm<FieldValues>({
    defaultValues: {
      category: '',
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      title: "",
      description: "",
      price: 1
    }
  });

  const category = watch('category');
  const location = watch('location');
  const guestCount = watch('guestCount')
  const roomCount = watch('roomCount')
  const bathroomCount = watch('bathroomCount');
  const imageSrc = watch('imageSrc')

  const Map = useMemo(() => {
    return dynamic(() => import('../Map'), {
      ssr: false
    })
  }, [location])

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    })
  }

  const onBack = () => {
    setStep(prev => prev - 1)
  }

  const onNext = () => {
    setStep(prev => prev + 1)
  }

  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return "Create";
    }

    return 'Next'
  }, [step])

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined;
    }

    return 'Back'
  }, [step])

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step != STEPS.PRICE) {
      return onNext();
    }

    setIsLoading(true);
    axios.post('/api/listings', data).then(
      () => {
        toast.success("Succefully created the listing!");
        router.refresh()
        reset();
        setStep(STEPS.CATEGORY)
        rentModal.onClose();
      }
    ).catch(() => {
      toast.error("something went wrong");
    }).finally(() => {
      setIsLoading(false);
    })

  }

  let bodyContent = (
    <div className='flex flex-col gap-8'>
      <Heading title='Which of these best describes your plae?'
        subtitle='Pick a category'
      />
      <div className='
            grid
            grid-cols-1
            md:grid-cols-2
            gap-3
            max-h-[50vh]
            overflow-y-auto'>
        {
          categories.map((item) => (<div
            key={item.label} className='col-span-1'>
            <CategoryInput
              icon={item.icon}
              label={item.label}
              onClick={(category) => setCustomValue('category', category)}
              selected={category === item.label}
            />
          </div>))
        }
      </div>

    </div>
  )

  if (STEPS.LOCATION == step) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Where is your place located?"
          subtitle="Help guests find you!"
        />
        <CountrySelect
          value={location}
          onChange={(value) => setCustomValue('location', value)}
        />

        <Map center={location?.latlng} />

      </div>
    );
  }
  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Share some basics about your place"
          subtitle="What amenitis do you have?"
        />
        <Counter
          onChange={(value) => setCustomValue('guestCount', value)}
          value={guestCount}
          title="Guests"
          subtitle="How many guests do you allow?"
        />
        <hr />
        <Counter
          onChange={(value) => setCustomValue('roomCount', value)}
          value={roomCount}
          title="Rooms"
          subtitle="How many rooms do you have?"
        />
        <hr />
        <Counter
          onChange={(value) => setCustomValue('bathroomCount', value)}
          value={bathroomCount}
          title="Bathrooms"
          subtitle="How many bathrooms do you have?"
        />
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add a photo of your place"
          subtitle="Show guests what your place looks like!"
        />
        <ImageUpload
          onChange={(value) => setCustomValue('imageSrc', value)}
          value={imageSrc}
        />
      </div>
    )
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="How would you describe your place?"
          subtitle="Short and sweet works best!"
        />
        <Input
          id="title"
          label="Title"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="description"
          label="Description"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    )
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Now, set your price"
          subtitle="How much do you charge per night?"
        />
        <Input
          id="price"
          label="Price"
          formatPrice
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    )
  }




  return (
    <Modal
      disabled={isLoading}
      isOpen={rentModal.isOpen}
      title="Airbnb your home!"
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      onClose={rentModal.onClose}
      body={bodyContent}
    />
  )
}

export default RentModal
