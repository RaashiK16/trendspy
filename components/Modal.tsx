"use client"
import { addUserEmailToProduct } from '@/lib/actions'
import { Description, Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import Image from 'next/image'
import { FormEvent, Fragment, useState } from 'react'

interface Props{
    productId:string
}

const Modal = ({productId}:Props) => {
    let [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setisSubmitting] = useState(false)
    const [email, setemail] = useState('')

    const handleSubmit = async(e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setisSubmitting(true);

        await addUserEmailToProduct(productId,email);
        setisSubmitting(false);
        setemail('');
        setIsOpen(false);
    }

    return (
        <>
            <button onClick={() => setIsOpen(true)} type='button' className='btn'>Track</button>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" onClose={() => setIsOpen(false)} className="dialog-container">
                    <div className='min-h-screen  px-4 text-center'>
                        {/* <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-100" enterTo='opacity-100' leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0" >
                            <DialogPanel className="fixed inset-0"/>
                        </TransitionChild> */}

                        <span className='inline-block h-screen align-middle' aria-hidden="true"/>

                        <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom='opacity-0 scale-95' enterTo='opacity-100 scale-100' leave="ease-in duration-200" leaveFrom='opacity-100 scale-100' leaveTo='opacity-0 scale-95' >
                            <div className="dialog-content">
                                <div className="flex flex-col">
                                    <div className="flex justify-between">
                                        <div className="p-3 border border-gray-200 rounded-10">
                                            <Image src="/assets/icons/logo.svg" alt='logo' width={28} height={28} />
                                        </div>
                                        <Image src="/assets/icons/x-close.svg" alt='close' width={24} height={24} className='cursor-pointer' onClick={()=>setIsOpen(false)}/>
                                    </div>
                                    <h4 className='dialog-head_text'>Stay updated with product pricing alerts right in your inbox</h4>
                                    <p className='text-sm text-gray-600 mt-2'>Never miss a bargain again with our timely alerts!</p>
                                </div>

                                <form onSubmit={handleSubmit} className='flex flex-col mt-5'>
                                    <label htmlFor="email" className='text-sm font-medium text-gray-700'>Email address</label>
                                    <div className="dialog-input_container">
                                        <Image src="/assets/icons/mail.svg" alt='mail' width={18} height={18} />
                                        <input value={email} onChange={e=>setemail(e.target.value)} type="email" required id="email" className='dialog-input' placeholder='Enter your email address' />
                                    </div>
                                    <button type='submit' className='dialog-btn'>
                                        {isSubmitting ? "Submitting..." :"Track"}
                                    </button>
                                </form>
                            </div>
                        </TransitionChild>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default Modal
