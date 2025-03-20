"use client";

import StudentForm from '@/src/components/organisms/StudentForm'
import React from 'react'

export default function Test() {
  return (
      <StudentForm onSubmit={()=>{return Promise.resolve(true)}} onCancel={()=>{}}/>
  )
}

