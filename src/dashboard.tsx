import React, { useState } from 'react';
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  createStyles,
  Group,
  Tooltip,
  ActionIcon,
  Checkbox,
  CheckboxProps,
  UnstyledButton
} from '@mantine/core';
import { MapContainer, TileLayer, useMap, Circle, LayersControl, Marker, Popup, GeoJSON } from 'react-leaflet';
import { Check, Plus } from 'tabler-icons-react';
import { SwitchToggle } from './ToggleTheme';
import pregnancy from './teen_pregnancy';
import wellbeing from './child_wellbeing';
import CSOs from './cso';
import { CONTROL_SIZES } from '@mantine/core/lib/components/NumberInput/NumberInput.styles';

const useStyles = createStyles((theme) => ({
    header: {
      paddingLeft: theme.spacing.md,
      paddingRight: theme.spacing.md,
    },
  
    inner: {
      height: 56,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  
    links: {
      [theme.fn.smallerThan('md')]: {
        display: 'none',
      },
    },
  
    search: {
      [theme.fn.smallerThan('xs')]: {
        display: 'none',
      },
    },
  
    link: {
      display: 'block',
      lineHeight: 1,
      padding: '8px 12px',
      borderRadius: theme.radius.sm,
      textDecoration: 'none',
      color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
      fontSize: theme.fontSizes.sm,
      fontWeight: 500,
  
      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      },
    },

    navbar: {
        paddingTop: 0,
      },
    
      section: {
        marginLeft: -theme.spacing.md,
        marginRight: -theme.spacing.md,
        marginBottom: theme.spacing.md,
    
      },
    
      searchCode: {
        fontWeight: 700,
        fontSize: 10,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
        border: `1px solid ${
          theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2]
        }`,
      },
    
      mainLinks: {
        paddingLeft: theme.spacing.md - theme.spacing.xs,
        paddingRight: theme.spacing.md - theme.spacing.xs,
        paddingBottom: theme.spacing.md,
      },
    
      mainLink: {
        display: 'flex',
        cursor: 'text',
        alignItems: 'center',
        width: '100%',
        fontSize: theme.fontSizes.xs,
        padding: `8px ${theme.spacing.xs}px`,
        borderRadius: theme.radius.sm,
        fontWeight: 500,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    
        '&:hover': {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
          color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
      },
    
      mainLinkInner: {
        display: 'flex',
        alignItems: 'center',
        flex: 1,
      },
    
      mainLinkIcon: {
        marginRight: theme.spacing.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
      },
    
      mainLinkBadge: {
        padding: 0,
        width: 20,
        height: 20,
        pointerEvents: 'none',
      },
    
      collections: {
        paddingLeft: theme.spacing.md - 6,
        paddingRight: theme.spacing.md - 6,
        paddingBottom: theme.spacing.md,
      },
    
      collectionsHeader: {
        paddingLeft: theme.spacing.md + 2,
        paddingRight: theme.spacing.md,
        marginBottom: 5,
      },
    
      collectionLink: {
        display: 'block',
        padding: `8px ${theme.spacing.xs}px`,
        textDecoration: 'none',
        cursor: 'text',
        borderRadius: theme.radius.sm,
        fontSize: theme.fontSizes.xs,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        lineHeight: 1,
        fontWeight: 500,
    
        '&:hover': {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
          color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
      },
  }));

  interface HeaderSearchProps {
    links: { link: string; label: string }[];
  }

export default function Dashboard() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [ctx, setCTX] = useState('');
  const [teen, setTean] = useState<boolean>(false);
  const [wellbeing2, setWellBeing] = useState<boolean>(false);
  const [cso, setCSO] = useState<boolean>(true);

  // filters
  const [health, setHealth] = useState(false);
  const [education, setEducation] = useState(false);
  const [protection, setProtection] = useState(false);
  const [advocacy, setAdvocacy] = useState(false);

  const { classes } = useStyles();
  const links =  [
    {
      "link": "#",
      "label": "About AICS"
    },
    {
      "link": "#",
      "label": "Data"
    }
  ]

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      onClick={(event) => event.preventDefault()}
    >
      {link.label}
    </a>
  ));

  const collections = [
    {id: 'all', label: 'All', value: cso},
    {id: 'health', label: 'Health', value: health },
    {id: 'education', label: 'Education', value: education},
    {id: 'protection', label: 'Protection', value: protection},
    {id: 'advocacy', label: 'Advocacy', value: advocacy},
  ];

  const links2 = [
    {id: 'teen',  label: 'Teen Pregnancy' },
    {id: 'wellbeing',  label: 'Child Wellbeing' },
  ];

  const handleMainLinks = (id: string) => {
    switch(id){
      case 'cso':
        setCSO(!cso);
        break;

      case 'teen':
        setTean(!teen);
        break;

      case 'wellbeing':
        setWellBeing(!wellbeing2);
        break;

      default:
        console.log('Error!');
    }

  }

  const TeenPregnancy = () => {
    return (
      <GeoJSON data={pregnancy} style={(f) => {return styleTeenPregnancy(f?.properties.T_Pregnanc)}} />
    )
  };

  const WellBeing = () => {
    return (
      <GeoJSON data={wellbeing} style={(f) => {return styleChildWellbeing(f?.properties.Wellbeing)}} />
    )
  }

  const CSOasPoints = () => {
    return (
      <GeoJSON data={CSOs} style={{opacity: 0.3}} />
    )
  }

  const HandleFilterH = () => {
    return (
      <GeoJSON data={CSOs} filter={(f) => {return f.properties.Health === 'Yes'}} />
    )
  }

  const HandleFilterE = () => {
    return (
      <GeoJSON data={CSOs} filter={(f) => {return f.properties.Education === 'Yes'}} />
    )
  }

  const HandleFilterP = () => {
    return (
      <GeoJSON data={CSOs} filter={(f) => {return f.properties.Protection === 'Yes'}} />
    )
  }

  const HandleFilterEM = () => {
    return (
      <GeoJSON data={CSOs} filter={(f) => {return f.properties.Empowerment === 'Yes'}} />
    )
  }

  const handleCSOs = (id: string) => {
    switch(id){
      case 'all':
        setCSO(!cso);
        setProtection(false);
        setAdvocacy(false);
        setEducation(false);
        setHealth(false);
        break;

      case 'health':
        setHealth(true);
        setCSO(false);
        setProtection(false);
        setAdvocacy(false);
        setEducation(false);
        break;

      case 'education':
        setEducation(true);
        setCSO(false);
        setHealth(false);
        setProtection(false);
        setAdvocacy(false);
        break;

      case 'protection':
        setProtection(true);
        setEducation(false);
        setCSO(false);
        setHealth(false);
        setAdvocacy(false);
        break;

      case 'advocacy':
        setAdvocacy(true);
        setEducation(false);
        setCSO(false);
        setHealth(false);
        setProtection(false);
        break;

      default:
        console.log('Error!');
    }
  }


  const CheckboxIcon: CheckboxProps['icon'] = ({ indeterminate, className }) =>
  indeterminate ? <Check className={className} /> : <Check className={className} />;

  const mainLinks = links2.map((link) => (
    <UnstyledButton key={link.label} className={classes.mainLink}>
      <div className={classes.mainLinkInner}>
        <span>{link.label}</span>
      </div>
      <Checkbox onClick={() => {handleMainLinks(link.id)}} icon={CheckboxIcon} />
    </UnstyledButton>
  ));

  const collectionLinks = collections.map((collection) => (
    <a
      href={'#/cso/'+collection.label}
      key={collection.label}
      className={classes.collectionLink}
    >
      <Group direction='row' position='apart'>
      {collection.label}
        <Checkbox checked={collection.value} onClick={() => {handleCSOs(collection.id)}} icon={CheckboxIcon} />
      </Group>
    </a>
  ));

  //ADDING TEEN PREGNANCY
	// get color depending on teen pregnancy rate value
	function getColorP(p: Number) {
    console.log(p);
		return p > 30 ? '#ae017e' : //#d7301f
				p > 20  ? '#f768a1' : //#fc8d59
				p > 10   ? '#fbb4b9' : //#fdcc8a
					   '#feebe2';//#fef0d9
	}

	function styleTeenPregnancy(p: any) {
		return {
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7,
			interactive: true,
			fillColor: getColorP(parseInt(p))
	}
}


//ADD CHILD WELLBEING DATA
	// get color depending on wellbeing value
  function getColorW(p: any){
    return p === 'Moderate' ? '#45ff08'://green
         p === 'Least'? '#ecfc03': //yellow
                       'gray';
  }

function styleChildWellbeing(w: any) {
return {
  weight: 2,
  opacity: 1,
  color: 'white',
  dashArray: '3',
  fillOpacity: 0.6,
  interactive: true,
  fillColor: getColorW(w)
};
}

  const MapView = () => {
    return (
        <MapContainer style={{height: '100%'}} center={[-0.89, 36.819]} zoom={6} scrollWheelZoom={true}>
  <LayersControl position='topright'>
  <LayersControl.BaseLayer checked name='OSM'>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url={theme.colorScheme === 'light' ? "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" : "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"}
  />
  </LayersControl.BaseLayer>
  <LayersControl.BaseLayer name='CartoDB'>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url={theme.colorScheme === 'light' ? "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png" : "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"}
  />
  </LayersControl.BaseLayer>
        <LayersControl.Overlay name='Local CSO Sites'>

        </LayersControl.Overlay>
        <LayersControl.Overlay name='Teen Pregnancy'>

        </LayersControl.Overlay>
        <LayersControl.Overlay name='Child Wellbeing'>

        </LayersControl.Overlay>
  </LayersControl>
  {teen ? <TeenPregnancy /> : null}
  {wellbeing2 ? <WellBeing /> : null}
  {cso ? <CSOasPoints /> : null}
  {health ? <HandleFilterH /> : null}
  {education ? <HandleFilterE /> : null}
  {protection ? <HandleFilterP /> : null}
  {advocacy ? <HandleFilterEM /> : null}
</MapContainer>
    )
  }
  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 250 }}>
<Navbar.Section className={classes.section}>
        <Group className={classes.collectionsHeader} position="apart">
          <Text size="xs" weight={500} color="dimmed">
            Local CSOs
          </Text>
        </Group>
        <div className={classes.collections}>{collectionLinks}</div>
      </Navbar.Section>
      <Navbar.Section className={classes.section}>
        <div className={classes.mainLinks}>{mainLinks}</div>
      </Navbar.Section>
        </Navbar>
      }
      aside={
        <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
          <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
            <Text>Statistics</Text>
          </Aside>
        </MediaQuery>
      }
      header={
        <Header height={56} className={classes.header}>
          <div className={classes.inner}>
            <Group>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <p>LOGO</p>
            </Group>

            <Group ml={50} spacing={5} className={classes.links}>
            {items}
          </Group>
          <SwitchToggle />
          </div>
        </Header>
      }
    >
    {!opened ?  <MapView /> : null}
    </AppShell>
  );
}