import React from 'react';
import ActivityFeed from './ActivityFeed';
import { IonRouterOutlet } from '@ionic/react';
import { Redirect, Route, useParams } from 'react-router-dom';

export default function ActivityFeedRouter (props) {
  console.log('activity router');
  

  return (
    <IonRouterOutlet>
      {/* <Route exact path={match.url} render={Requests} /> */}
      {/* <Route path={'/activity/requests'} render={props => <ActivityFeed {...{...props, tab: 'requests'}} />} /> */}
      {/* <Route path={'/activity/bids'} render={props => <ActivityFeed {...{...props, tab: 'bids'}} />} /> */}
      <Route path={'/activity/:tab'} component={ActivityFeed} />
      <Redirect exact from='/activity' to='/activity/requests' />
    </IonRouterOutlet>
  );
};
