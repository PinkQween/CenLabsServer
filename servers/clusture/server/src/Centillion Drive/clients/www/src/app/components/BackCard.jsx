import React, { useEffect, useRef } from 'react';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const Card = ({ onClick }) => {
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
      <p className='font-bold text-ellipsis whitespace-nowrap max-width-[10vw] overflow-hidden'>Back</p>
      {/* <p>Type: {type}</p> */}
      <div className='bg-[#00000044] items-center flex justify-center align-middle aspect-[11/4] rounded-3xl my-2'>
        <ArrowBackIosNewIcon sx={{ width: '140%', height: '140%' }} />
      </div>
    </div>
  );
};

export default Card;
