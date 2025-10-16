import type { RouteObject } from 'react-router-dom';
import ExplorePage from './pages/ExplorePage';
import LabsPage from './pages/LabsPage';
import AppLayout from '../../app/layouts/AppLayout';
import AiLayout from './AiLayout';

export const routes: RouteObject[] = [
    {
        element: <AppLayout />,               // 外层：AppLayout（头部/顶栏等）
        children: [
            {
                element: <AiLayout />,            // 内层：AiLayout（带侧边栏）
                children: [
                    { index: true, element: <ExplorePage /> },     // /ai
                    { path: 'explore', element: <ExplorePage /> }, // /ai/explore
                    { path: 'labs',    element: <LabsPage /> }     // /ai/labs
                ]
            }
        ]
    }
];
