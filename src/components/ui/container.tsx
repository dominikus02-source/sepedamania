import { cn } from '@/lib/utils';

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  );
}

export function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={cn('py-6 sm:py-8', className)}>
      {children}
    </section>
  );
}

export function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4 sm:mb-5">
      <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] flex items-center gap-2">
        <span className="w-1 h-6 bg-[#FBBF24] rounded-full inline-block" />
        {title}
      </h2>
      {action}
    </div>
  );
}

export function SectionSubtitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-[#64748B] mt-0.5">{children}</p>
  );
}
