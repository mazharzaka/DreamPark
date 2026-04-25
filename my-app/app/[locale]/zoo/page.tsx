'use client';
import { AdrenalineWorlds } from '@/src/features/portal/components/AdrenalineWorlds';
import { OurHeroesSlider } from '@/src/features/portal/components/OurHeroesSlider';
import { SlideContent } from '@/src/features/portal/components/SlideContent'
import { MOCK_ANIMALS } from '@/src/features/portal/data/mockAttractions';
import { MOCK_HEROES } from '@/src/features/portal/data/mockHeroes';
import { ZooHero } from '@/src/features/portal/data/mockHeroSlides'
import React from 'react'
function ZooPage() {
    return (
        <main className='mt-[106px]'>
            <div className='h-[80dvh]'>
                <SlideContent slide={ZooHero} isActive={true} />
            </div>
            <div >
                <AdrenalineWorlds title="DreamZoo" link='zoo/animals' attractions={MOCK_ANIMALS} />

            </div>
            <OurHeroesSlider mockHeroes={MOCK_HEROES} title="Portal.OurHeroes" />


        </main>
    )
}

export default ZooPage