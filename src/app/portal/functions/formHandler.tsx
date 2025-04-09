/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import type { Id, ToastContent, ToastOptions } from 'react-toastify'
import { useState } from 'react'
import { toast } from 'react-toastify'

export type TForm = {
  type?: string
  email: ''
  password: ''
}

const formHandler = (
  initial: TForm = {
    email: '',
    password: '',
  },
) => {
  const [formData, setFormData] = useState(initial)

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const target = e.target
    const name = target.name

    const value =
      target instanceof HTMLInputElement && target.type === 'checkbox'
        ? target.checked
        : target.value

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const executeForm = async (
    e: React.FormEvent,
    callback: (
      form: TForm,
      toast: (
        content: ToastContent<unknown>,
        options?: ToastOptions<unknown>,
      ) => Id,
    ) => Promise<void>,
  ) => {
    e.preventDefault()
    await callback(formData, toast)
  }

  return { handleChange, executeForm }
}

export { formHandler }
