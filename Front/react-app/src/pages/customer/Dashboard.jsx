import React from 'react'

export default function Dashboard() {
    return (
        <div className='flex'>
            <div className='h-screen'>
                <div className='bg-blue-700 w-screen h-1/2 rounded-3xl rounded-t-none'>
                    <div className='p-4 font-extrabold text-4xl text-white'>
                        ATM
                    </div>
                </div>
            </div>
            <div className='w-full h-full flex absolute justify-center'>
                <div className='bg-blue-900 w-5/6 h-2/3 absolute self-center rounded-2xl shadow-black shadow-lg'>
                    <div className='p-4 text-white font-medium text-2xl'>
                        Saldo Rekening
                    </div>
                    <div className='px-4 text-white font-bold text-6xl'>
                        Rp 3000000,00
                    </div>
                    <div className='w-full h-2/5 rounded-2xl bg-blue-950 mt-24 flex px-5 justify-between text-white items-center'>
                        <div className='bg-blue-900 p-3 rounded-lg font-bold cursor-pointer'>
                            Transfer
                        </div>
                        <div className='bg-blue-900 p-3 rounded-lg font-bold cursor-pointer'>
                            Tarik Tunai
                        </div>
                        <div className='bg-blue-900 p-3 rounded-lg font-bold cursor-pointer'>
                            Setor Tunai
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
