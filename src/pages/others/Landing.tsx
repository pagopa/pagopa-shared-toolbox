import React from "react";
import BlockItem from "../../components/generic/BlockItem";

const blockData = [
    {
        id: 1,
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Grafana_icon.svg',
        altText: 'Grafana Logo',
        title: 'Grafana',
        description: 'Piattaforma di osservabilità e analisi che permette di visualizzare, analizzare e comprendere metriche, log e tracce da diverse fonti di dati in dashboard personalizzabili.',
        href: 'https://pagopa-d-weu-grafana-emfwascrf8c4fyce.weu.grafana.azure.com/',
    },
    {
        id: 2,
        logoUrl: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/elasticsearch.svg',
        altText: 'Kibana Logo',
        title: 'Kibana',
        description: 'Piattaforma di visualizzazione e interfaccia utente dell\'Elastic Stack, utilizzata per navigare, analizzare e visualizzare dati di log e metriche memorizzati in Elasticsearch.',
        href: 'https://reactjs.org/docs/state-and-lifecycle.html',
    },
    {
        id: 3,
        logoUrl: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/metabase.svg',
        altText: 'Metabase Icon',
        title: 'Metabase',
        description: 'Strumento di business intelligence che consente agli utenti, anche non tecnici, di porre domande sui dati e visualizzare le risposte tramite dashboard e report intuitivi.',
        href: 'https://pagopa-p-itn-dbsecurity-metabase-webapp.azurewebsites.net/',
    },
];

const Landing = () => (
    <div className="container py-5">
        <h2 className="text-center mb-4">Risorse Utili</h2>

        <div className="row">
            {blockData.map((block) => (
                <BlockItem
                    key={block.id}
                    logoUrl={block.logoUrl}
                    altText={block.altText}
                    title={block.title}
                    description={block.description}
                    href={block.href}
                />
            ))}
        </div>
    </div>
);

export default Landing;
