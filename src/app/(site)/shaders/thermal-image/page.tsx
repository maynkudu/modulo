import { ComponentDetail } from "@/components/component-detail";
import { ThermalImageDemo } from "@/components/thermal-image-demo";
import { thermalImage } from "@/lib/catalog";
import { getComponentMetadata } from "@/lib/seo";

export const metadata = getComponentMetadata(thermalImage);

export default function ThermalImagePage() {
  return <ComponentDetail
    item={thermalImage}
    layout="self-contained"
    fullHref="/view/thermal-image"
    idea={<p>The default subject is an original 3D study of the Porsche 911 GT3 RS. The shader uses light on the bodywork and the silhouette of the wheels and wing to build its moving bands of color.</p>}
    interaction={<><p>Drag the car or use the Car angle and Camera elevation sliders to rotate it. Choose Original paint to inspect the olive bodywork and bronze wheels, or try Thermal, Night vision, Ultraviolet and Ice. Upload a photo to apply the same effect at its own aspect ratio, then choose Use GT3 RS model to return to the car.</p><p>Animate controls the moving color field. You can turn the car while the effect is paused or reduced motion is enabled.</p></>}
    attribution={<p>The thermal effect adapts the Heat car study by <a href="https://www.blankinterfaces.com/f1/heatcar.html" target="_blank" rel="noreferrer">Blank Interfaces</a>, which credits Studio Gruhl&apos;s Rerun gear film. Modulo modeled the car from the supplied side photograph and <a href="https://newsroom.porsche.com/en/2022/products/porsche-911-gt3-rs-world-premiere-29177.html" target="_blank" rel="noreferrer">Porsche’s studio photographs</a>.</p>}
  >
    <ThermalImageDemo />
  </ComponentDetail>;
}
