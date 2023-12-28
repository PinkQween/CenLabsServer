import React, { useEffect, useRef } from 'react';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader';

const Card = ({ name, type, lastModified, contents, onClick }) => {
  // const containerRef = useRef();

  // useEffect(() => {
  //   if (type === "application/x.autodesk.fbx" && contents) {
  //     // Initialize three.js scene
  //     const scene = new THREE.Scene();
  //     const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
  //     const renderer = new THREE.WebGLRenderer();

  //     renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
  //     containerRef.current.appendChild(renderer.domElement);

  //     // Load FBX model
  //     const loader = new FBXLoader();
  //     loader.parse(atob(contents), '', (fbx) => {
  //       scene.add(fbx);
  //     });

  //     // Camera setup
  //     camera.position.z = 5;

  //     // Animation/rendering loop
  //     const animate = () => {
  //       requestAnimationFrame(animate);
  //       renderer.render(scene, camera);
  //     };

  //     animate();

  //     // Cleanup on component unmount
  //     return () => {
  //       containerRef.current.removeChild(renderer.domElement);
  //     };
  //   }
  // }, [type, contents]);

  return (
    <div className="bg-[#88888834] p-4 m-2 rounded-xl cursor-pointer w-[23vw] py-1" onClick={onClick}>
      <p className='font-bold text-ellipsis whitespace-nowrap max-width-[10vw] overflow-hidden'>{name}</p>
      {/* <p>Type: {type}</p> */}
      <div className='bg-[#00000044] items-center flex justify-center align-middle aspect-[11/4] rounded-3xl my-2'>
      {type === `directory` ? (
          <FolderIcon sx={{ width: '140%', height: '140%' }} />
        ) : type.startsWith("image/") ? (
          <img src={`data:${type};base64,${contents}`} alt={name} style={{ width: '140%', height: '140%', objectFit: 'contain' }} />
          ) : type === "application/xml" ? (
              // <div dangerouslySetInnerHTML={{ __html: contents }} />
              <InsertDriveFileIcon sx={{ width: '140%', height: '140%' }} />
          ) : type === "application/x.autodesk.fbx" ? (
          // <div ref={containerRef}></div>
          <ViewInArIcon sx={{ width: '140%', height: '140%' }} />
        ) : (
          <InsertDriveFileIcon sx={{ width: '140%', height: '140%' }} />
        )}
      </div>
      <p>Last Modified: {lastModified}</p>
    </div>
  );
};

export default Card;
