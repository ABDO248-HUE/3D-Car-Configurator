# 3D Car Configurator

An interactive 3D car configurator built with Three.js.

The application allows users to view and customize a 3D Ferrari F430 model directly in the browser.

## Features

- Interactive 3D car model
- Orbit controls for rotating and zooming
- Automatic car rotation
- Car body color customization
- Wheel color customization
- Reset configuration
- Responsive layout
- Performance-aware 3D loading
- Reduced Motion support
- Static image fallback for weak devices
- Lazy loading of the 3D model

## Technologies

- HTML5
- CSS3
- JavaScript
- Three.js
- GLTF / GLB
- Vite

## 3D Model

The project uses a GLB version of the car model.

The selected GLB model is approximately 3.6 MB, which provides a reasonable balance between visual quality and loading performance.

The model is loaded dynamically instead of being part of the initial page load.

## Performance Optimization

### 1. Fallback for Weak Devices

The application checks the user's device capabilities before loading the 3D model.

It considers:

- `prefers-reduced-motion`
- CPU hardware concurrency
- Available device memory

If the device appears to have limited resources, the application displays a static image instead of loading the 3D model.

This reduces GPU and memory usage and provides a more accessible experience for users with performance limitations.

### 2. Reduced Motion

The application respects the user's system preference:

```text
prefers-reduced-motion: reduce
