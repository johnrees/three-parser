import * as THREE from "three";
import {BoxGeometry} from "three";
import {WrappedEntityDescriptor, WrapperDetails} from "../../common/ObjectWrapper";

interface IBoxGeometryProps extends IObject3DProps {
  width: number; // — Width of the sides on the X axis.
  height: number; // — Height of the sides on the Y axis.
  depth: number; // — Depth of the sides on the Z axis.
  widthSegments?: number; // — Number of segmented faces along the width of the sides.
  heightSegments?: number; // — Number of segmented faces along the height of the sides.
  depthSegments?: number; // — Number of segmented faces along the depth of the sides.
  
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      boxGeometry: IThreeElementPropsBase<BoxGeometry> & IBoxGeometryProps;
    }
  }
}

class BoxGeometryWrapper extends WrapperDetails<IBoxGeometryProps,BoxGeometry> {

  constructor(props: IBoxGeometryProps) {
    super(props);
  }

  this.wrapObject(new BoxGeometry(props.width,props.height,props.depth,props.widthSegments,props.heightSegments,props.depthSegments,));
  }
}

class BoxGeometryDescriptor extends WrappedEntityDescriptor<IBoxGeometryProps,
  BoxGeometry,
  BoxGeometryWrapper> {
    constructor() {
      super(BoxGeometryWrapper, BoxGeometry);

      this.hasRemountProps(
         "width", "height", "depth", "widthSegments", "heightSegments", "depthSegments",
      );
    }
  }

export default BoxGeometryDescriptor;
