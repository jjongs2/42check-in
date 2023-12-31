import type { ReactElement } from 'react';

import WarningModal from '../modal/WarningModal';

export default function Error(): ReactElement {
  return (
    <WarningModal>
      <p className='text-modal text-left'>잘못된 요청입니다.</p>
    </WarningModal>
  );
}
