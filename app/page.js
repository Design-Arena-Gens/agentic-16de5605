'use client';

import { useEffect, useMemo, useState } from 'react';

const slides = [
  {
    type: 'title',
    title: 'LDAP – Lightweight Directory Access Protocol',
    subtitle: 'Verzeichnisdienste verstehen und sicher betreiben',
    names: ['Erstellt von: Team Infrastruktur']
  },
  {
    type: 'list',
    title: 'Was ist LDAP? (Grundlagen)',
    items: [
      'Protokoll zur Abfrage und Verwaltung von Verzeichnisdiensten',
      'Typische Serversysteme: OpenLDAP, Active Directory',
      'Hierarchische Baumstruktur für Objekte und Attribute'
    ]
  },
  {
    type: 'sections',
    title: 'Warum LDAP? (Schutzziele & Notwendigkeit)',
    sections: [
      {
        heading: 'Schutzziele',
        points: [
          'Verfügbarkeit: Zentrale Nutzerverwaltung für viele Systeme',
          'Integrität: Konsistente Daten durch definierte Schemas & Replikation',
          'Vertraulichkeit: Zugriffskontrollen, Verschlüsselung via LDAPS/TLS'
        ]
      },
      {
        heading: 'Notwendigkeit',
        points: [
          'Unternehmensweite Benutzer- und Ressourcenverwaltung',
          'Skalierbare, zentrale Authentifizierung für Anwendungen & Geräte'
        ]
      }
    ]
  },
  {
    type: 'diagram',
    title: 'LDAP-Struktur (Beispiel)',
    description: 'Hierarchische Organisation der Verzeichniseinträge',
    rootDn: 'dc=schule,dc=de'
  },
  {
    type: 'list',
    title: 'Wie funktioniert LDAP? (1/2)',
    items: [
      'Client/Server-Modell mit persistenten Verbindungen',
      'Anfragen bestehen aus Operationen wie „Bind“, „Search“, „Compare“, „Modify“',
      'Server antwortet mit Ergebniseinträgen und Status-Codes',
      'Absicherung via LDAPS (Port 636) oder StartTLS auf Port 389'
    ]
  }
];

const keyNavigations = ['ArrowRight', 'ArrowLeft', 'PageUp', 'PageDown', 'Home', 'End', ' '];

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleKey = (event) => {
      if (!keyNavigations.includes(event.key)) return;

      switch (event.key) {
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
          event.preventDefault();
          goNext();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          event.preventDefault();
          goPrev();
          break;
        case 'Home':
          setCurrentSlide(0);
          break;
        case 'End':
          setCurrentSlide(slides.length - 1);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const progress = useMemo(
    () => Math.round(((currentSlide + 1) / slides.length) * 100),
    [currentSlide]
  );

  const goNext = () => setCurrentSlide((index) => Math.min(slides.length - 1, index + 1));
  const goPrev = () => setCurrentSlide((index) => Math.max(0, index - 1));

  return (
    <main className="deck">
      <header className="deck__meta">
        <div className="deck__progress" aria-hidden>
          <div className="deck__progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="deck__counter">
          Folie {currentSlide + 1} / {slides.length}
        </div>
      </header>

      <section className="slide" role="group" aria-roledescription="slide">
        <SlideContent {...slides[currentSlide]} />
      </section>

      <footer className="deck__controls" aria-label="Navigation">
        <button type="button" onClick={goPrev} disabled={currentSlide === 0}>
          Zurück
        </button>
        <button type="button" onClick={goNext} disabled={currentSlide === slides.length - 1}>
          Weiter
        </button>
      </footer>
    </main>
  );
}

function SlideContent(props) {
  if (props.type === 'title') {
    return (
      <div className="slide__title">
        <div className="slide__tag">LDAP</div>
        <h1>{props.title}</h1>
        <p className="slide__subtitle">{props.subtitle}</p>
        <ul className="slide__names">
          {props.names.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (props.type === 'list') {
    return (
      <div className="slide__content">
        <h2>{props.title}</h2>
        <ul>
          {props.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (props.type === 'sections') {
    return (
      <div className="slide__content">
        <h2>{props.title}</h2>
        <div className="slide__columns">
          {props.sections.map((section) => (
            <div className="slide__column" key={section.heading}>
              <h3>{section.heading}</h3>
              <ul>
                {section.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (props.type === 'diagram') {
    return (
      <div className="slide__content">
        <h2>{props.title}</h2>
        <p className="slide__lead">{props.description}</p>
        <TreeDiagram rootDn={props.rootDn} />
      </div>
    );
  }

  return null;
}

function TreeDiagram({ rootDn }) {
  const tree = {
    name: rootDn,
    children: [
      {
        name: 'ou=users',
        children: [
          { name: 'cn=Max Muster (User)' },
          { name: 'cn=Lehrkräfte (Group)' }
        ]
      },
      {
        name: 'ou=devices',
        children: [
          { name: 'cn=Laptop-01 (Device)' },
          { name: 'cn=Drucker-02 (Device)' }
        ]
      },
      {
        name: 'ou=policies',
        children: [
          { name: 'cn=PasswortPolicy' },
          { name: 'cn=NetzwerkZugriff' }
        ]
      }
    ]
  };

  return (
    <div className="tree">
      <TreeNode node={tree} />
    </div>
  );
}

function TreeNode({ node }) {
  if (!node.children) {
    return <div className="tree__node tree__node--leaf">{node.name}</div>;
  }

  return (
    <div className="tree__node">
      <div className="tree__label">{node.name}</div>
      <div className="tree__children">
        {node.children.map((child) => (
          <TreeNode key={child.name} node={child} />
        ))}
      </div>
    </div>
  );
}
