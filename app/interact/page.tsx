// pages/stl-viewer.js
import React from 'react';
import DynamicGLTFViewer from '../components/DynamicGLTFViewer';

export default function STLViewerPage() {
  const stlFileUrl = '/GHOST.stl'; // Replace with the path to your STL file

  return (
    <div>
      <DynamicGLTFViewer url={stlFileUrl} />
    </div>
  );
}