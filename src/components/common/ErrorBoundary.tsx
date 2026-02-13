'use client'

import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md text-center">
            <div className="text-6xl mb-6">⚠️</div>
            <h1 className="text-3xl font-serif font-bold text-cream-100 mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-cream-200 font-sans mb-6">
              We encountered an error while loading this page. Please try refreshing or return to the homepage.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-forest-900 font-sans font-semibold transition-colors"
              >
                Refresh Page
              </button>
              <a
                href="/"
                className="px-6 py-3 border-2 border-cream-100 text-cream-100 hover:bg-cream-400/10 font-sans font-semibold transition-colors inline-block"
              >
                Go Home
              </a>
            </div>
            {this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm text-cream-300 font-sans">
                  Error details
                </summary>
                <pre className="mt-2 p-4 bg-cream-400/10 rounded text-xs overflow-auto text-cream-200">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
