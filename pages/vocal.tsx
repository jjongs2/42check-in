import ModalWrapper from '@/components/common/ModalWrapper';
import EquipmentsForm from '@/components/form/EquipmentsForm';
import PresentationsForm from '@/components/form/PresentationsForm';
import VisitorsForm from '@/components/form/VisitorsForm';
import WarningModal from '@/components/modal/WarningModal';
import VocalStatusBoard from '@/components/status/VocalStatusBoard';
import type { ApplicationFormInfo } from '@/interfaces/FormInfo';
import apiController from '@/utils/apiController';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';

export default function Vocal(): ReactElement {
  const router = useRouter();
  const [category, setCategory] = useState<string>();
  const [changePresentations, setChangePresentations] = useState({});
  const [checkedList, setCheckedList] = useState<ApplicationFormInfo[]>([]);
  const [isFormSelected, setIsFormSelected] = useState<boolean>();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const { category: categoryQuery, formInfo } = router.query;
    if (categoryQuery === undefined) {
      void router.push({
        query: { category: 'visitors' },
      });
      return;
    }
    setCategory(categoryQuery as string);
    setIsFormSelected(Boolean(formInfo));
  }, [router]);

  const staff = localStorage.getItem('staff');
  if (staff === 'false') {
    return (
      <WarningModal href='/'>
        <p className='text-modal text-left'>접근 권한이 없습니다.</p>
      </WarningModal>
    );
  }

  const selectedForm = (): ReactElement => {
    if (!isFormSelected) return;

    switch (category) {
      case 'visitors':
        return <VisitorsForm />;
      case 'presentations':
        return <PresentationsForm />;
      case 'equipments':
        return <EquipmentsForm />;
    }
  };

  const onClick = async (formIds: ApplicationFormInfo[]): Promise<void> => {
    const formId = formIds.map((info) => info.formId);
    const config = {
      url: `/vocal/subscriptions/${category}`,
      method: 'POST',
      data: { formIds: formId },
    };
    await apiController(config);
  };

  const onClickPresentations = async (presenList: {}): Promise<void> => {
    const config = {
      url: '/vocal/subscriptions/presentations',
      method: 'POST',
      data: { presenList },
    };
    await apiController(config);
  };

  return (
    <div className='flex h-full flex-col justify-evenly lg:flex-row'>
      <VocalStatusBoard
        category={category}
        setCheckedList={setCheckedList}
        checkedList={checkedList}
        setChangePresentations={setChangePresentations}
        changePresentations={changePresentations}
      />
      <div className='m-4 flex flex-col overflow-auto rounded-xl'>
        {selectedForm()} {/* 선택된 폼 상세 내용  */}
      </div>
      <button
        onClick={() => {
          if (checkedList.length === 0) {
            alert('체크 박스로 선택 후 승인해주세요.');
            return;
          }
          setShowModal(true);
        }}
        className='absolute bottom-10 right-10 z-50 h-14 w-14 rounded-full bg-teal-400 text-lg text-white shadow-xl ring-2 ring-teal-300 transition-colors hover:animate-pulse hover:bg-teal-300 hover:ring-2 hover:ring-teal-300 hover:ring-offset-2 dark:hover:text-black'
      >
        승인
      </button>
      {showModal && (
        <ModalWrapper>
          <div className='text-modal'>해당 신청서를 승인 하시나요??</div>
          <div className='flex justify-center space-x-2'>
            <button
              onClick={(event) => {
                setShowModal(false);
              }}
              className='button-modal dark:text-white'
            >
              취소
            </button>
            <button
              onClick={(event) => {
                if (category !== 'presentations') void onClick(checkedList);
                else void onClickPresentations(changePresentations);
                setShowModal(false);
              }}
              className='button-modal dark:text-white'
            >
              승인
            </button>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
}
