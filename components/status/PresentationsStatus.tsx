import { PRESENTATION_STATUS } from '@/constants/status';
import TIMES from '@/constants/times';
import type PresentationsFormInfo from '@/interfaces/PresentationsFormInfo';
import { cls } from '@/styles/cls';
import dayjs from 'dayjs';
import type { Dispatch, ReactElement } from 'react';

interface PresentationsStatusProps {
  status: PresentationsFormInfo;
  setChangePresentations: Dispatch<React.SetStateAction<{}>>;
  changePresentations: {};
}

export default function PresentationsStatus({
  status,
  setChangePresentations,
  changePresentations,
}: PresentationsStatusProps): ReactElement {
  const date = dayjs(status.date).format('YY.MM.DD (ddd)');

  const onChange = (e) => {
    const { id, value } = e.target;
    const newStatus = { ...changePresentations };
    if (value === '0') {
      delete newStatus[id];
    } else {
      newStatus[id] = value;
    }
    setChangePresentations(newStatus);
  };

  let statusColor: string;
  switch (status.status) {
    case 0: {
      statusColor = 'bg-yellow-300 dark:bg-yellow-700';
      break;
    }
    case 4: {
      statusColor = 'bg-purple-300 dark:bg-purple-700';
      break;
    }
    default: {
      statusColor = 'bg-green-400 dark:bg-green-800';
    }
  }

  return (
    <div className='flex h-full w-full flex-col items-end justify-center'>
      <div className='mt-6 flex w-full items-center justify-between text-sm'>
        <div className='ml-1 flex w-[18%] justify-center whitespace-nowrap text-center dark:text-white '>
          {date}
        </div>
        <div className='column-separator' />
        <div className='w-[10%] text-center dark:text-white'>{TIMES[status.time]}</div>
        <div className='column-separator' />
        <div className='w-[31%] whitespace-nowrap text-center dark:text-gray-300'>
          {status.intraId}
        </div>
        <div className='column-separator' />
        <select
          name='statusBox'
          id={status.formId.toString()}
          onChange={onChange}
          onClick={(e) => {
            e.stopPropagation();
          }}
          defaultValue={status.status}
          className={cls(
            status.status !== 4 ? 'visible' : 'invisible',
            'w-[21%] text-center text-xs transition group-hover:bg-[#6AA6FF] group-hover:transition group-hover:duration-300 group-hover:ease-in-out dark:bg-slate-800 dark:group-hover:bg-gray-700 sm:text-sm',
          )}
        >
          <option value='0'>선택해주세요.</option>
          <option value='1'>{PRESENTATION_STATUS[1]}</option>
          <option value='2'>{PRESENTATION_STATUS[2]}</option>
          <option value='3'>{PRESENTATION_STATUS[3]}</option>
        </select>
      </div>
      <div
        className={cls(
          statusColor,
          'relative -top-12 right-3 h-[24px] w-max whitespace-nowrap rounded-xl px-2 text-sm text-gray-700 dark:text-gray-300',
        )}
      >
        {PRESENTATION_STATUS[status.status]}
      </div>
    </div>
  );
}
