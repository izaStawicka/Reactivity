import React, { useEffect, useState } from 'react';
import {  Grid, Loader } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityFilters from './ActivityFilters';
import { PagingParams } from '../../../app/models/pagination';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityListItemPlaceholder from './ActivityListItemPlaceholder';

export default observer(function ActivityDashboard()
{
    const {activityStore} = useStore();
    const {loadActivities, activityRegistry, pagination, setPagingParams, loadingInitial} = activityStore;
    const [loadingNext, setLoadingNext] = useState(false);

    useEffect(()=>{
      if(activityRegistry.size<=1) loadActivities();
      }, [loadActivities, activityRegistry]);
  

      function handleLoadNext() {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.pageNumber+1));
        loadActivities().then(() => setLoadingNext(false));
      }

    return (
        <Grid>
            <Grid.Column width='10'>
              {loadingInitial && !loadingNext ? (
                <>
                   <ActivityListItemPlaceholder/>
                  <ActivityListItemPlaceholder/>
                </>
              ) : (
                <InfiniteScroll pageStart={0} initialLoad={false} loadMore={handleLoadNext} hasMore={!loadingNext && !!pagination && pagination.pageNumber < pagination.totalPages}>
                <ActivityList/>
              </InfiniteScroll>
              )}
            </Grid.Column>
            <Grid.Column width='6'>
               <ActivityFilters/>
            </Grid.Column>
            <Grid.Column width={10}>
              <Loader active={loadingNext}/>
            </Grid.Column>
        </Grid>
    )
})