import React from 'react'

const Loading = () => {
  return (
    <div className='flex justify-center h-screen items-center'>
      <div className='animate-spin size-8 border-2 rounded-full border-indigo-600 border-t-transparent'/>
    </div>
  )
}

export default Loading
