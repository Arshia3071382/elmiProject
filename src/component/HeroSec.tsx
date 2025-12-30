import React from 'react'
import Container from './Container'
import Image from 'next/image'
import heroImg from "./../../public/image/hero.png"

function HeroSec() {
  return (
    <Container>
      <div className='w-5/6 mx-auto mt-15 lg:h-[450px] '>
        <Image 
          src={heroImg} 
          alt='herosection' 
          className="w-full h-full object-cover rounded "
        />
      </div>
    </Container>
  )
}

export default HeroSec