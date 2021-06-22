import React, { useMemo } from 'react';
import CommonPageStyles from '../components/BaseComponents/CommonPageStyles';
import LoadingView from '../components/BaseComponents/LoadingView';
import Layout from '../components/layout';
import { AttendeesTable } from '../components/TableComponents';
import { useAuthenFetchPost } from '../hooks/useFetch';
import useFirebaseWrapper from '../hooks/useFirebaseWrapper';

export default () => {
  const { currentUserInfo, isLoadingUserInfo } = useFirebaseWrapper();

  const { result: listOfAttendees } = useAuthenFetchPost(
    '/api/get_user_table_sorted',
    {
      relevance: [],
      location: [],
    },
    currentUserInfo
      ? {
        id: currentUserInfo.uid,
      }
      : undefined,
  );

  // -- DATA
  const columns = useMemo(
    () => [
      {
        Header: 'Name (pronouns)',
        accessor: 'fullname',
      },
      {
        Header: 'Institution',
        accessor: 'institution',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
    ],
    [],
  );

  const data = useMemo(() => listOfAttendees, [listOfAttendees]);

  // console.log(listOfAttendees);

  // -- RENDER
  if (isLoadingUserInfo) {
    return <LoadingView />;
  }

  return (
    <Layout>
      <CommonPageStyles>
        <h2>List of attendees</h2>
        <p>
          Here are all the attendees at the conference (updated once a day). We list the attendees
          based on your relevance.
        </p>
      </CommonPageStyles>
      <AttendeesTable defaultColumns={columns} data={data} />
    </Layout>
  );
};
