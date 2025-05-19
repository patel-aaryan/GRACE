import { MainLayout } from "@/components/layout/main-layout";

export default function AboutPage() {
  return (
    <MainLayout>
      <section className="py-12 md:py-24 w-full min-h-screen">
        <div className="container mx-auto px-4 md:px-6 max-w-full">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                About Us
              </h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Learn more about our company and our mission
              </p>
            </div>
          </div>
          <div className="mx-auto mt-12 max-w-3xl space-y-6">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              euismod, diam quis aliquam ultricies, nunc nisl aliquet nunc, quis
              aliquam nisl nunc quis nisl. Sed euismod, diam quis aliquam
              ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis
              nisl.
            </p>
            <p>
              Sed euismod, diam quis aliquam ultricies, nunc nisl aliquet nunc,
              quis aliquam nisl nunc quis nisl. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Sed euismod, diam quis aliquam
              ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis
              nisl.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              euismod, diam quis aliquam ultricies, nunc nisl aliquet nunc, quis
              aliquam nisl nunc quis nisl. Sed euismod, diam quis aliquam
              ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis
              nisl.
            </p>
            <h2 className="text-2xl font-bold tracking-tight mt-8">Our Team</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              euismod, diam quis aliquam ultricies, nunc nisl aliquet nunc, quis
              aliquam nisl nunc quis nisl. Sed euismod, diam quis aliquam
              ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis
              nisl.
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
