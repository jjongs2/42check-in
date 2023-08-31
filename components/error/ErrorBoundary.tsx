import logout from '@/utils/logout';
import { AxiosError, AxiosResponse, isAxiosError } from 'axios';
import Router, { useRouter } from 'next/router';
import React, { Component } from 'react';
import type { PropsWithChildren, ReactElement, ReactNode } from 'react';

import Contact from '../Contact';
import WarningModal from '../modal/WarningModal';
import Error from './Error';

type ErrorBoundaryProps = PropsWithChildren<{}>;

interface ErrorBoundaryState {
  error: Error;
}

const errorBoundaryState: ErrorBoundaryState = {
  error: null,
};

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = errorBoundaryState;
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error(error);
    return { error };
  }

  private readonly resetState = (): void => {
    this.setState(errorBoundaryState);
  };

  private readonly setError = (error: Error): void => {
    this.setState({ error });
  };

  private readonly handleAxiosError = ({ data, status }: AxiosResponse): ReactElement => {
    if (status === 503) {
      if (data === 1008) {
        return (
          <WarningModal>
            <div className='text-modal text-left'>
              <p>같은 시간대에</p>
              <p>다른 회의실 예약 내역이 존재해요!</p>
            </div>
          </WarningModal>
        );
      }
      return <Contact />;
    }
    logout();
    return <Error />;
  };

  private readonly handleError = (event: ErrorEvent): void => {
    this.setError(event.error);
    event.preventDefault?.();
  };

  private readonly handleRejectedPromise = (event: PromiseRejectionEvent): void => {
    event?.promise?.catch?.(this.setError);
    event.preventDefault?.();
  };

  componentDidMount(): void {
    window.addEventListener('error', this.handleError);
    window.addEventListener('unhandledrejection', this.handleRejectedPromise);
    Router.events.on('routeChangeStart', this.resetState);
  }

  componentWillUnmount(): void {
    window.removeEventListener('error', this.handleError);
    window.removeEventListener('unhandledrejection', this.handleRejectedPromise);
    Router.events.off('routeChangeStart', this.resetState);
  }

  render(): ReactNode {
    const { error } = this.state;
    if (error === null) {
      return this.props.children;
    }
    console.warn('ErrorBoundary: ', error);
    if (isAxiosError(error)) {
      return this.handleAxiosError(error.response);
    }
    return <Error />;
  }
}
