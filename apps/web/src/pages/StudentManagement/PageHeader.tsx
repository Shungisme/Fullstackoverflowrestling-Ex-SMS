import React from 'react'

type PageHeaderProps = {
    title: string;
    description: string;
}

const PageHeader = ({title, description}: PageHeaderProps) => {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

export default PageHeader
