//从世界坐标得到以弧度表示的经纬度
export function getRadiansFromCartesian3(viewer, cartesian3) {
  return viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian3);
}

//从世界坐标得到以角度表示的经纬度
export function getCartographicFromCartesian3(viewer, cartesian3) {
  const cartographic = getRadiansFromCartesian3(viewer, cartesian3);
  return getDegreeFromRadian(cartographic);
}

//经纬度从弧度转为角度
export function getDegreeFromRadian(cartographic) {
  cartographic.longitude = Cesium.Math.toDegrees(cartographic.longitude);
  cartographic.latitude = Cesium.Math.toDegrees(cartographic.latitude);
  return cartographic;
}

//从canvas坐标得到世界坐标
export function getCartesian3FromClient(viewer, client) {
  return viewer.camera.pickEllipsoid(client, viewer.scene.globe.ellipsoid);
}

//从世界坐标得到canvas坐标
export function getClientFromCartesian3(viewer, cartesian3) {
  return Cesium.SceneTransforms.wgs84ToWindowCoordinates(
    viewer.scene,
    cartesian3
  );
}

//从角度制的经纬度得到世界坐标
export function getCartesian3FromDegree(viewer, cartographic) {
  if (Array.isArray(cartographic)) {
    return cartographic.map((i) => {
      return Cesium.Cartesian3.fromDegrees(
        +i.longitude,
        +i.latitude,
        +i.height,
        viewer.scene.globe.ellipsoid
      );
    });
  } else {
    return Cesium.Cartesian3.fromDegrees(
      +cartographic.longitude,
      +cartographic.latitude,
      +cartographic.height,
      viewer.scene.globe.ellipsoid
    );
  }
}

//从弧度制的经纬度得到世界坐标
export function getCartesian3FromRadian(viewer, cartographic) {
  return Cesium.Cartesian3.fromRadians(
    cartographic.longitude,
    cartographic.latitude,
    cartographic.height,
    viewer.scene.globe.ellipsoid
  );
}

//从canvas坐标得到弧度制的经纬度
export function getRadiansFromClient(viewer, client) {
  return getRadiansFromCartesian3(getCartesian3FromClient(viewer, client));
}

//从canvas坐标得到角度制的经纬度
export function getCartographicFromClient(viewer, client) {
  return getCartographicFromCartesian3(
    viewer,
    getCartesian3FromClient(viewer, client)
  );
}

export function wrap2Cartographic(obj) {
  return new Cesium.Cartographic(obj.positionX, obj.positionY, obj.positionZ);
}

export function cartographicExpand(cartographic) {
  return {
    positionX: cartographic.longitude,
    positionY: cartographic.latitude,
    positionZ: cartographic.height
  };
}
