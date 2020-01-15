import React from 'react';
import { Wave } from 'react-animated-text';
import './SplashPage.scss';

export default function SplashPage() {
  return (
    <div className='splash-page'>
      <div className='splash-page__container'>
        <Wave className='splash-page__loader' speed={5} text='weQuest' effect='stretch' effectChange={1.5} />
      </div>
    </div>
  );
}
