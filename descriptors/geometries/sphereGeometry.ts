import * as THREE from "three";
import {SphereGeometry} from "three";
import {WrappedEntityDescriptor, WrapperDetails} from "../../common/ObjectWrapper";

interface ISphereGeometryProps extends IObject3DProps {
  radius: number; // — sphere radius. Default is 50.
  widthSegments?: number; // — number of horizontal segments. Minimum value is 3, and the default is 8.
  heightSegments?: number; // — number of vertical segments. Minimum value is 2, and the default is 6.
  phiStart?: number; // — specify horizontal starting angle. Default is 0.
  phiLength?: number; // — specify horizontal sweep angle size. Default is Math.PI * 2.
  thetaStart?: number; // — specify vertical starting angle. Default is 0.
  thetaLength?: number; // — specify vertical sweep angle size. Default is Math.PI.
  
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      sphereGeometry: IThreeElementPropsBase<SphereGeometry> & ISphereGeometryProps;
    }
  }
}

class SphereGeometryWrapper extends WrapperDetails<ISphereGeometryProps,SphereGeometry> {

  constructor(props: ISphereGeometryProps) {
    super(props);
  }

  this.wrapObject(new SphereGeometry(props.radius,props.widthSegments,props.heightSegments,props.phiStart,props.phiLength,props.thetaStart,props.thetaLength,));
  }
}

class SphereGeometryDescriptor extends WrappedEntityDescriptor<ISphereGeometryProps,
  SphereGeometry,
  SphereGeometryWrapper> {
    constructor() {
      super(SphereGeometryWrapper, SphereGeometry);

      this.hasRemountProps(
         "radius", "widthSegments", "heightSegments", "phiStart", "phiLength", "thetaStart", "thetaLength",
      );
    }
  }

export default SphereGeometryDescriptor;
