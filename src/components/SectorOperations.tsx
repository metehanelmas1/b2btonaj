import React from 'react';
import { SectorType } from '../types';
import { KeresteOperations } from './sectors/KeresteOperations';
import { BetonOperations } from './sectors/BetonOperations';
import { TasOcagiOperations } from './sectors/TasOcagiOperations';
import { DemirOperations } from './sectors/DemirOperations';
import { HurdaOperations } from './sectors/HurdaOperations';
import { AntrepoOperations } from './sectors/AntrepoOperations';
import { NakliyeOperations } from './sectors/NakliyeOperations';

interface SectorOperationsProps {
  activeSector: SectorType;
  onSelectSector: (sector: SectorType) => void;
  onOpenWeighing: () => void;
}

export const SectorOperations: React.FC<SectorOperationsProps> = ({
  activeSector,
  onOpenWeighing
}) => {
  switch (activeSector) {
    case 'kereste':
      return <KeresteOperations onOpenWeighing={onOpenWeighing} />;

    case 'beton':
      return <BetonOperations onOpenWeighing={onOpenWeighing} />;

    case 'tas_ocagi':
      return <TasOcagiOperations onOpenWeighing={onOpenWeighing} />;

    case 'demir':
      return <DemirOperations onOpenWeighing={onOpenWeighing} />;

    case 'hurda':
      return <HurdaOperations onOpenWeighing={onOpenWeighing} />;

    case 'antrepo_gumruk':
      return <AntrepoOperations onOpenWeighing={onOpenWeighing} />;

    case 'nakliye_lojistik':
      return <NakliyeOperations onOpenWeighing={onOpenWeighing} />;

    default:
      return <TasOcagiOperations onOpenWeighing={onOpenWeighing} />;
  }
};
