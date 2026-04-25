import { InteractiveMap } from "./InteractiveMap";

export function MapContainer() {
  return (
    <section className="w-full py-20 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <InteractiveMap />
      </div>
    </section>
  );
}
