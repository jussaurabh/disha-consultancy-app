export function BrandPanel() {
  return (
    <div className="relative flex h-full w-full items-center bg-zinc-900 px-6 md:px-8 lg:justify-center lg:px-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(circle_at_center,rgba(238,51,56,0.08)_1px,transparent_1px)] bg-size-[20px_20px] lg:block"
      />

      <div className="relative z-10 flex items-center gap-3 lg:flex-col lg:items-start lg:gap-3">
        <div className="size-2 rounded-full bg-[#EE3338]" />

        <p className="text-sm font-semibold text-zinc-50 md:text-base lg:text-xl lg:leading-7">
          <span className="md:hidden">Disha</span>
          <span className="hidden md:inline lg:hidden">Disha Payroll</span>
          <span className="hidden lg:inline">Disha Payroll Consultancy</span>
        </p>

        <p className="hidden text-[15px] leading-[22px] text-zinc-400 lg:block">
          Manage your consultancy with confidence.
        </p>
      </div>
    </div>
  );
}
