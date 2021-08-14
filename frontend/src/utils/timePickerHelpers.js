import moment from 'moment';
import { timeBoundary } from '../pages/abstract-submission/components/AvailableTimePicker';
import common from './common';

// this function convert selectedDatetimeObj to string dtISO1;dtISO2;...
const serializeSelectedDatetime = (selectedDatetimeObj) => (
  common.flat(selectedDatetimeObj.map((eachPar) => (
    eachPar.time.map((eachTime) => {
      // filter only datetime in the valid range
      const inValidRange = moment(eachTime).isBetween(
        timeBoundary[0],
        timeBoundary[1],
        undefined,
        '(]',
      );

      if (inValidRange) {
        return eachTime;
      }

      return null;
    })
  ))).filter((x) => x).sort().join(';'));

const deserializeSelectedDatetime = (serializedDatetimeString) => (
  serializedDatetimeString
    ? (
      serializedDatetimeString.split(';').reduce((acc, cur) => {
        const curDate = moment(cur).format('MMMM DD, YYYY');
        const exist = acc.find((x) => x.date === curDate);
        const existInd = acc.indexOf(exist);

        if (exist) {
          return [
            ...acc.slice(0, existInd),
            {
              ...exist,
              time: [
                ...exist.time,
                cur,
              ],
            },
            ...acc.slice(existInd + 1),
          ];
        }

        return [
          ...acc,
          {
            date: curDate,
            time: [cur],
          },
        ];
      }, [])
    )
    : []
);

export default {
  serializeSelectedDatetime,
  deserializeSelectedDatetime,
};
