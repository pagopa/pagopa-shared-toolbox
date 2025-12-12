import React from "react";
import BlockItem from "../../components/generic/BlockItem";
import {FaLock} from "react-icons/fa";

const blockData = [
    {
        id: 1,
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Grafana_icon.svg',
        altText: 'Grafana Logo',
        title: 'Grafana',
        description: 'Piattaforma di osservabilità e analisi che permette di visualizzare, analizzare e comprendere metriche, log e tracce da diverse fonti di dati in dashboard personalizzabili.',
        buttons: [
            {
                href: 'https://pagopa-d-weu-grafana-emfwascrf8c4fyce.weu.grafana.azure.com/',
                text: 'DEV'
            },
            {
                href: 'https://pagopa-u-weu-grafana-cpavbjb0axhrdcg3.weu.grafana.azure.com/',
                text: 'UAT'
            },
            {
                href: 'https://pagopa-p-weu-grafana-avb5f4e0fqawgyea.weu.grafana.azure.com/',
                text: 'PROD'
            }
        ]
    },
    {
        id: 2,
        logoUrl: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/elasticsearch.svg',
        altText: 'Kibana Logo',
        title: 'Kibana',
        description: 'Piattaforma di visualizzazione e interfaccia utente dell\'Elastic Stack, utilizzata per navigare, analizzare e visualizzare dati di log e metriche memorizzati in Elasticsearch.',
        buttons: [
            {
                href: 'https://pagopa-s-weu-ec.kb.westeurope.azure.elastic-cloud.com/',
                text: 'DEV'
            },
            {
                href: 'https://pagopa-s-weu-ec.kb.westeurope.azure.elastic-cloud.com/',
                text: 'UAT'
            },
            {
                href: 'https://pagopa-p-weu-ec.kb.westeurope.azure.elastic-cloud.com/',
                text: 'PROD'
            }
        ]
    },

    {
        id: 4,
        logoUrl: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/metabase.svg',
        altText: 'Metabase Icon',
        title: 'Metabase',
        description: 'Strumento di business intelligence che consente agli utenti, anche non tecnici, di porre domande sui dati e visualizzare le risposte tramite dashboard e report intuitivi.<br/>Richiede la <b>VPN</b> di <span class="badge badge-success">PROD</span>.',
        buttons: [
            {
                href: 'https://pagopa-p-itn-dbsecurity-metabase-webapp.azurewebsites.net/',
                text: (
                    <>
                        <FaLock className="ml-1 mr-1" /> PROD
                    </>
                )
            }
        ]
    },
    {
        id: 4,
        logoUrl: 'https://raw.githubusercontent.com/pagopa/payment-cloud-domain-builder/main/docs/images/icon.png',
        altText: 'Domain Builder icon',
        title: 'Domain Builder',
        description: 'Strumento per lo scaffolding di un nuovo dominio in pagopa-infra.<br/>Richiede la <b>VPN</b> di <span class="badge badge-info">DEV</span>.',
        buttons: [
            {
                href: 'https://weudev.shared.internal.dev.platform.pagopa.it/domain-builder',
                text: (
                    <>
                        <FaLock className="ml-1 mr-1" /> DEV
                    </>
                )
            }
        ]
    },
];

const Landing = () => (
    <div className="row">
        <div className="col-12">
            <div className="useful-resources mt-4">
                <div className="row">
                    {blockData.map((block) => (
                        <BlockItem
                            key={block.id}
                            logoUrl={block.logoUrl}
                            altText={block.altText}
                            title={block.title}
                            description={block.description}
                            buttons={block.buttons}
                        />
                    ))}
                </div>
            </div>
        </div>
        <div className="col-12">
            <div className="status-page">
                <iframe id="status-page"
                        src="https://pagopa.github.io/pagopa-status-page/"
                        title="Status-Page"
                        width="100%"
                        height="1000"
                        loading="lazy"
                />
            </div>
        </div>
    </div>
);

export default Landing;
