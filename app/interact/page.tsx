// pages/stl-viewer.js
import React from 'react';
import DynamicSTLViewer from './components/DynamicSTLViewer';
import DynamicGLTFViewer from './components/DynamicGLTFViewer';

export default function STLViewerPage() {
  const stlFileUrl = '/GHOST.stl'; // Replace with the path to your STL file

  return (
    <div>
      <h1>STL 3D Viewer</h1>
      <DynamicGLTFViewer url={stlFileUrl} />
    </div>
  );
}