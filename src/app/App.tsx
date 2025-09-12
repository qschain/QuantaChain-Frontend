import AppRoutes from './router/AppRoutes';
import React from 'react';

class ErrorBoundary extends React.Component<{children: React.ReactNode},{err?:any}> {
    state = { err: undefined as any };
    static getDerivedStateFromError(err:any){ return { err }; }
    componentDidCatch(err:any, info:any){ console.error('[App ErrorBoundary]', err, info); }
    render(){
        if (this.state.err) {
            return <pre style={{padding:16, color:'red', textAlign:'left'}}>
        {(this.state.err?.message || String(this.state.err)) + '\n\n' +
            (this.state.err?.stack || '')}
      </pre>;
        }
        return this.props.children as any;
    }
}

export default function App() {
    return (
        <ErrorBoundary>
            <AppRoutes />
        </ErrorBoundary>
    );
}
