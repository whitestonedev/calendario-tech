import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Github,
  Calendar,
  Users,
  Code,
  Globe,
  Server,
  Database,
  Terminal,
  Search,
  MapPin,
  Tag,
  Wallet,
  Copy,
  Check,
} from 'lucide-react';
import SubmitEventDialog from '@/components/SubmitEventDialog';
import { useLanguage } from '@/context/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { LanguageCodes } from '@/types/language';

const Contribute = () => {
  const { t } = useLanguage();
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const CodeBlock = ({ code, id }: { code: string; id: string }) => (
    <div className="bg-gray-100 p-2 rounded-md overflow-x-auto flex items-center justify-between">
      <code>{code}</code>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 hover:bg-gray-200"
        onClick={() => handleCopy(code, id)}
      >
        {copiedStates[id] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );

  const jsonResponse = [
    {
      id: 7,
      event_name: '7ª Edição | Cripto - Especial Fênix | A Retomada da Comunidade Tech!',
      organization_name: 'whiteStone_dev',
      start_datetime: '2025-04-24T19:00:00',
      end_datetime: '2025-04-24T22:00:00',
      address: 'R. Avenida das Águias, Av. Pedra Branca, 231, Palhoça - SC, 88137-280, Brasil',
      event_link: 'https://whitestonedev.com.br/eventos/agenda/2025-04-24-fenix/',
      maps_link:
        'https://www.google.com/maps?q=R.+Avenida+das+Águias,+231,+Palhoça+-+SC,+88137-280',
      online: false,
      tags: [
        '7ª Edição',
        'Fênix',
        'Meetup',
        'Cripto',
        'DeFi',
        'NFTs',
        'Blockchain',
        'Smart Contracts',
        'Comunidade',
      ],
      intl: {
        [LanguageCodes.PORTUGUESE]: {
          banner_link: 'https://images.sympla.com.br/67c9b8f5522dc-lg.png',
          cost: 'Gratuito',
          event_edition: 'Edição 7',
          short_description:
            'O reencontro da whiteStone_dev com foco no universo cripto, blockchain, DeFi e NFTs. Uma noite de muito conteúdo, networking e inovação.',
        },
        [LanguageCodes.ENGLISH]: {
          banner_link: 'https://images.sympla.com.br/67c9b8f5522dc-lg.png',
          cost: 'Free',
          event_edition: 'Edition 7',
          short_description:
            'The whiteStone_dev reunion focused on crypto, blockchain, DeFi, and NFTs. A night full of talks, networking, and innovation.',
        },
      },
    },
  ];

  const endpointExample = 'https://api.calendario.tech/events?tags=python&tags=kubernetes';

  return (
    <div>
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('contribute.title')}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('contribute.subtitle')}</p>
      </section>

      <section className="mb-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Users className="mr-2 h-6 w-6 text-tech-purple" />
            {t('contribute.howTo')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-tech-purple" />
                  {t('contribute.addEvents')}
                </CardTitle>
                <CardDescription>{t('contribute.addEventsDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{t('contribute.addEventsContent')}</p>
              </CardContent>
              <CardFooter>
                <SubmitEventDialog />
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5 text-tech-purple" />
                  {t('contribute.region')}
                </CardTitle>
                <CardDescription>{t('contribute.regionDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{t('contribute.regionContent')}</p>
              </CardContent>
              <CardFooter>
                <Button className="bg-tech-blue hover:bg-tech-blue/90" asChild>
                  <a
                    href="https://github.com/whitestonedev/calendario-tech"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('contribute.learnMore')}
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <section className="mb-12 bg-gray-50 py-12 px-4 rounded-lg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Server className="mr-2 h-6 w-6 text-tech-purple" />
            {t('contribute.publicApi')}
          </h2>

          <p className="mb-6 text-lg">{t('contribute.publicApiDesc')}</p>

          <div className="bg-black rounded-lg text-white p-4 mb-6 overflow-x-auto flex items-center justify-between">
            <code className="text-sm">{endpointExample}</code>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-white hover:bg-white/10"
              onClick={() => handleCopy(endpointExample, 'main-endpoint')}
            >
              {copiedStates['main-endpoint'] ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <div className="mr-3 mt-1">
                <Terminal className="h-5 w-5 text-tech-purple" />
              </div>
              <div>
                <strong className="text-lg">{t('contribute.openApi')}</strong>
                <p className="text-gray-600">
                  {t('contribute.openApiDesc')}{' '}
                  <a
                    href="https://api.calendario.tech/openapi/scalar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-tech-purple hover:underline"
                  >
                    api.calendario.tech/openapi/scalar
                  </a>
                  .
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-3 mt-1">
                <Database className="h-5 w-5 text-tech-purple" />
              </div>
              <div>
                <strong className="text-lg">{t('contribute.openData')}</strong>
                <p className="text-gray-600">{t('contribute.openDataDesc')}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-3 mt-1">
                <Code className="h-5 w-5 text-tech-purple" />
              </div>
              <div>
                <strong className="text-lg">{t('contribute.openSourceBackend')}</strong>
                <p className="text-gray-600">{t('contribute.openSourceBackendDesc')}</p>
              </div>
            </div>
          </div>

          <Accordion type="single" collapsible className="bg-white rounded-lg shadow-sm mb-6">
            <AccordionItem value="examples" className="border-0">
              <AccordionTrigger className="px-4 py-3 bg-tech-purple/5 rounded-t-lg hover:bg-tech-purple/10 hover:no-underline font-semibold">
                <Server className="mr-2 h-5 w-5 text-tech-purple" />
                {t('contribute.apiExamples')}
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-4 pb-2 text-sm">
                <div className="space-y-6 prose-sm max-w-none">
                  {/* Listar Eventos */}
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      <Terminal className="mr-2 h-5 w-5 text-tech-purple" />
                      {t('contribute.listAllEvents')}
                    </h3>
                    <p>{t('contribute.listAllEventsDesc')}</p>
                    <CodeBlock code="curl https://api.calendario.tech/events" id="list-all" />

                    {/* Payload Example */}
                    <div className="mt-4">
                      <p className="font-medium mb-2">{t('contribute.responseExample')}</p>
                      <div className="relative">
                        <SyntaxHighlighter
                          language="json"
                          style={vscDarkPlus}
                          customStyle={{
                            borderRadius: '0.5rem',
                            fontSize: '0.75rem',
                          }}
                        >
                          {JSON.stringify(jsonResponse, null, 2)}
                        </SyntaxHighlighter>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 text-white hover:text-white hover:bg-white/10"
                          onClick={() =>
                            handleCopy(JSON.stringify(jsonResponse, null, 2), 'json-example')
                          }
                        >
                          {copiedStates['json-example'] ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Filtrar por Nome */}
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      <Search className="mr-2 h-5 w-5 text-tech-purple" />
                      {t('contribute.filterByName')}
                    </h3>
                    <p>{t('contribute.filterByNameDesc')}</p>
                    <CodeBlock
                      code='curl "https://api.calendario.tech/events?name=python"'
                      id="filter-name"
                    />
                  </div>

                  {/* Filtrar por Localização */}
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      <MapPin className="mr-2 h-5 w-5 text-tech-purple" />
                      {t('contribute.filterByLocation')}
                    </h3>
                    <p>{t('contribute.filterByLocationDesc')}</p>
                    <CodeBlock
                      code='curl "https://api.calendario.tech/events?address=Sao%20Paulo"'
                      id="filter-address"
                    />
                  </div>

                  {/* Filtrar por Tags */}
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      <Tag className="mr-2 h-5 w-5 text-tech-purple" />
                      {t('contribute.filterByTags')}
                    </h3>
                    <p>{t('contribute.filterByTagsDesc')}</p>
                    <CodeBlock
                      code='curl "https://api.calendario.tech/events?tags=frontend"'
                      id="filter-tags"
                    />
                    <p className="mt-2">{t('contribute.multipleTags')}</p>
                    <CodeBlock
                      code='curl "https://api.calendario.tech/events?tags=frontend&tags=react"'
                      id="filter-multiple-tags"
                    />
                  </div>

                  {/* Filtrar por Tipo */}
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      <Globe className="mr-2 h-5 w-5 text-tech-purple" />
                      {t('contribute.filterByType')}
                    </h3>
                    <p>{t('contribute.filterByTypeDesc')}</p>
                    <CodeBlock
                      code='curl "https://api.calendario.tech/events?online=true"'
                      id="filter-type"
                    />
                  </div>

                  {/* Filtrar por Preço */}
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      <Wallet className="mr-2 h-5 w-5 text-tech-purple" />
                      {t('contribute.filterByPrice')}
                    </h3>
                    <p>{t('contribute.filterByPriceDesc')}</p>
                    <CodeBlock
                      code='curl "https://api.calendario.tech/events?price_type=free"'
                      id="filter-price-free"
                    />
                    <p className="mt-2">{t('contribute.priceRange')}</p>
                    <CodeBlock
                      code='curl "https://api.calendario.tech/events?price_min=50&price_max=200"'
                      id="filter-price-range"
                    />
                  </div>

                  {/* Filtrar por Data */}
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-tech-purple" />
                      {t('contribute.filterByDate')}
                    </h3>
                    <p>{t('contribute.filterByDateFrom')}</p>
                    <CodeBlock
                      code='curl "https://api.calendario.tech/events?date_from=2025-06-01"'
                      id="filter-date-from"
                    />
                    <p className="mt-2">{t('contribute.filterByDateRange')}</p>
                    <CodeBlock
                      code='curl "https://api.calendario.tech/events?date_start_range=2025-06-01&date_end_range=2025-06-30"'
                      id="filter-date-range"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="text-center">
            <Button className="bg-tech-purple hover:bg-tech-purple/90" asChild>
              <a
                href="https://api.calendario.tech/openapi/scalar#tag/events/GET/events"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                <Server className="mr-2 h-5 w-5" />
                {t('contribute.exploreApi')}
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="mb-12 bg-gray-50 py-12 px-4 rounded-lg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Code className="mr-2 h-6 w-6 text-tech-purple" />
            {t('contribute.code')}
          </h2>

          <p className="mb-6 text-lg">{t('contribute.codeDesc')}</p>

          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <div className="min-w-[24px] h-6 w-6 rounded-full bg-tech-purple text-white flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                1
              </div>
              <div>
                <strong className="text-lg">{t('contribute.reportBugs')}</strong>
                <p className="text-gray-600">{t('contribute.reportBugsDesc')}</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="min-w-[24px] h-6 w-6 rounded-full bg-tech-purple text-white flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                2
              </div>
              <div>
                <strong className="text-lg">{t('contribute.implement')}</strong>
                <p className="text-gray-600">{t('contribute.implementDesc')}</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="min-w-[24px] h-6 w-6 rounded-full bg-tech-purple text-white flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                3
              </div>
              <div>
                <strong className="text-lg">{t('contribute.docs')}</strong>
                <p className="text-gray-600">{t('contribute.docsDesc')}</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="min-w-[24px] h-6 w-6 rounded-full bg-tech-purple text-white flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                4
              </div>
              <div>
                <strong className="text-lg">{t('contribute.help')}</strong>
                <p className="text-gray-600">{t('contribute.helpDesc')}</p>
              </div>
            </li>
          </ul>

          <div className="text-center">
            <Button className="bg-tech-dark hover:bg-tech-dark/90" asChild>
              <a
                href="https://github.com/whitestonedev/calendario-tech"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                <Github className="mr-2 h-5 w-5" />
                {t('contribute.github')}
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">{t('contribute.ready')}</h2>
        <p className="text-lg text-gray-600 mb-6">{t('contribute.readyDesc')}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild>
            <Link to="/">{t('contribute.viewEvents')}</Link>
          </Button>
          <SubmitEventDialog
            trigger={<Button variant="outline">{t('contribute.addEvent')}</Button>}
          />
        </div>
      </section>
    </div>
  );
};

export default Contribute;
