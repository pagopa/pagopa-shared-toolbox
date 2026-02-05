import React from "react";
import BlockItem from "../../components/generic/BlockItem";
import blocks from "../../config/landing-blocks.json";

const Landing: React.FC = () => (
  <div className="row">
    <div className="col-12">
      <div className="useful-resources mt-4">
        <div className="row">
          {blocks.map((block) => (
            <BlockItem
              key={block.id}
              logoUrl={block.logoUrl}
              altText={block.altText}
              title={block.title}
              description={block.description}
              buttons={block.buttons as any}
            />
          ))}
        </div>
      </div>
    </div>
    <div className="col-12">
      <div className="status-page">
        <iframe
          id="status-page"
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
