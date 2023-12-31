import PAGES from '@/constants/pages';
import { useRouter } from 'next/router';
import type { ChangeEventHandler, ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';
import type { RegisterOptions } from 'react-hook-form';

interface FormTextAreaProps {
  name: string;
  title: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  registerOptions?: RegisterOptions;
  value?: string;
}

export default function FormTextArea({
  name,
  title,
  onChange,
  placeholder,
  registerOptions = { required: true },
  value,
}: FormTextAreaProps): ReactElement {
  const { register } = useFormContext();
  const router = useRouter();

  const disabled = PAGES.readOnly.has(router.pathname) || router.query.formInfo !== undefined;

  return (
    <div className='col-span-full'>
      <label
        htmlFor={title}
        className='block text-sm font-medium leading-6 text-gray-900 dark:text-white'
      >
        {title}
      </label>
      <div className='mt-2.5'>
        <textarea
          id={name}
          rows={4}
          className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          {...register(name, registerOptions)}
        />
      </div>
    </div>
  );
}
