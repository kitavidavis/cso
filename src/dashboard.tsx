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
  UnstyledButton,
  SimpleGrid,
  Paper,
  RingProgress,
  Center,
  TextInput,
  Button,
  Select
} from '@mantine/core';
import { MapContainer, TileLayer, useMap, Circle, CircleMarker, LayersControl, Marker, Popup, GeoJSON } from 'react-leaflet';
import { ArrowUpRight, Check, Filter, Location, Plus } from 'tabler-icons-react';
import { SwitchToggle } from './ToggleTheme';
import pregnancy from './teen_pregnancy';
import wellbeing from './child_wellbeing';
import { StatsRing } from './statistics';
import  CSOs from './updatedCSO';
const kenyacounties = require('kenyacounties');
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
  const [circleArr, setCircleArr] = useState([]);
  // filters
  const [health, setHealth] = useState(false);
  const [education, setEducation] = useState(false);
  const [protection, setProtection] = useState(false);
  const [advocacy, setAdvocacy] = useState(false);

  const [total, setTotal] = useState<number>(CSOs.features.length);
  const [healtht, setHealthTotal] = useState<number>(0);
  const [educationt, setEducationTotal] = useState<number>(0);
  const [protectiont, setProtectionTotal] = useState<number>(0);
  const [empowermentt, setEmpowermentTotal] = useState<number>(0);

  const [code, setCode] = useState<number>(0);

  // kenya counties
  let kenya_counties = kenyacounties.getAll();

  // filter by country
  const [county, setCounty] = useState<string>('');

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

  const handleMainLinks = (id: string) => {
    switch(id){
      case 'cso':
        setCSO(!cso);
        setOpened(false);
        break;

      case 'teen':
        setTean(!teen);
        setOpened(false);
        break;

      case 'wellbeing':
        setWellBeing(!wellbeing2);
        setOpened(false);
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
  
  const handleURL = (label: string) => {
  	switch(label){
	      case 'all':
        setCSO(!cso);
        setProtection(false);
        setAdvocacy(false);
        setEducation(false);
        setHealth(false);
        setOpened(false);
        break;

      case 'health':
        setHealth(true);
        setCSO(false);
        setProtection(false);
        setAdvocacy(false);
        setEducation(false);
        setOpened(false);
        break;

      case 'education':
        setEducation(true);
        setCSO(false);
        setHealth(false);
        setProtection(false);
        setAdvocacy(false);
        setOpened(false);
        break;

      case 'protection':
        setProtection(true);
        setEducation(false);
        setCSO(false);
        setHealth(false);
        setAdvocacy(false);
        setOpened(false);
        break;

      case 'advocacy':
        setAdvocacy(true);
        setEducation(false);
        setCSO(false);
        setHealth(false);
        setProtection(false);
        setOpened(false);
        break;

      default:
        console.log('Error!');
	}
  }


  const handleCSOs = (id: string) => {
    switch(id){
      case 'all':
        setCSO(!cso);
        setProtection(false);
        setAdvocacy(false);
        setEducation(false);
        setHealth(false);
        setOpened(false);
        break;

      case 'health':
        setHealth(true);
        setCSO(false);
        setProtection(false);
        setAdvocacy(false);
        setEducation(false);
        setOpened(false);
        break;

      case 'education':
        setEducation(true);
        setCSO(false);
        setHealth(false);
        setProtection(false);
        setAdvocacy(false);
        setOpened(false);
        break;

      case 'protection':
        setProtection(true);
        setEducation(false);
        setCSO(false);
        setHealth(false);
        setAdvocacy(false);
        setOpened(false);
        break;

      case 'advocacy':
        setAdvocacy(true);
        setEducation(false);
        setCSO(false);
        setHealth(false);
        setProtection(false);
        setOpened(false);
        break;

      default:
        console.log('Error!');
    }
  }


  const CheckboxIcon: CheckboxProps['icon'] = ({ indeterminate, className }) =>
  indeterminate ? <Check className={className} /> : <Check className={className} />;

  const collectionLinks = collections.map((collection) => (
    <a
      href={'#/cso/'+collection.label}
	onClick={()=> handleURL(collection.id)}
      key={collection.label}
      className={classes.collectionLink}
    >
      <Group direction='row' position='apart'>
      {collection.label}
        <Checkbox checked={collection.value} onChange={() => {handleCSOs(collection.id)}} onClick={() => {handleCSOs(collection.id)}} icon={CheckboxIcon} />
      </Group>
    </a>
  ));

  //ADDING TEEN PREGNANCY
	// get color depending on teen pregnancy rate value
	function getColorP(p: Number) {
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

React.useEffect(() => {
  const simpleArithmetics = () => {
    let sumH = 0;
    let sumE = 0;
    let sumP = 0;
    let sumEM = 0;

    for(let i=0; i<CSOs.features.length; i++){
      let item = CSOs.features[i];

      if(item.properties.Health !== null){
        sumH++
      }

      if(item.properties.Education !== null){
        sumE++
      }

      if(item.properties.Protection !== null){
        sumP++
      }

      if(item.properties.Empowerment !== null){
        sumEM++
      }
    }

    setHealthTotal(sumH);
    setEducationTotal(sumE);
    setProtectionTotal(sumP);
    setEmpowermentTotal(sumEM);
  }

  simpleArithmetics();

  
}, [])


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
  </LayersControl>
  {cso ? CSOs.features.map((item: any) => {
    if(item.properties.Latitude !== null){
      if(county !== ' '){
        if((item.properties.county === county) || item.properties.county.includes(county)){
          return (
            <CircleMarker key={item.properties.Latitude + 'all'+ item.properties.Longitude} fillColor='cyan' radius={5} center={[item.properties.Latitude, item.properties.Longitude]}>
              <Popup>
              <div style={{height: 200, overflowY: 'auto', width: '100%'}} >
                <table className='table'>
                  <tbody>
                    <tr>
                    <td><strong>Name</strong></td>
                      <td>
                      <strong>{item.properties.Organization}</strong>
                      </td>
                      </tr>
                      <tr>
                      <td><strong>Contact Person</strong></td>
                      <td>
                        {item.properties.contact}
                      </td>
                      </tr>
                      <tr>
                      <td><strong>Phone</strong></td>
                      <td>
                        <a href={'tel:+'+item.properties.phone}>{"+"+item.properties.phone}</a>
                      </td>
                      </tr>
                      <tr>
                      <td><strong>Email</strong></td>
                      <td>
                        <a href={'mailto:'+item.properties.email}>{item.properties.email}</a>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Website</strong>
                      </td>
                      <td>
                        <a target={'_blank'} href={item.properties.website}>{item.properties.website}</a>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>County</strong></td>
                      <td>{item.properties.county}</td>
                    </tr>
                  </tbody>
                </table>
                </div>
              </Popup>
            </CircleMarker>
          )
        }
      } else {
        return (
          <CircleMarker key={item.properties.Latitude + 'all'+ item.properties.Longitude} fillColor='cyan' radius={5} center={[item.properties.Latitude, item.properties.Longitude]}>
            <Popup>
            <div style={{height: 200, overflowY: 'auto', width: '100%'}} >
              <table className='table'>
                <tbody>
                  <tr>
                  <td><strong>Name</strong></td>
                    <td>
                    <strong>{item.properties.Organization}</strong>
                    </td>
                    </tr>
                    <tr>
                    <td><strong>Contact Person</strong></td>
                    <td>
                      {item.properties.contact}
                    </td>
                    </tr>
                    <tr>
                    <td><strong>Phone</strong></td>
                    <td>
                    <a href={'tel:+'+item.properties.phone}>{"+"+item.properties.phone}</a>
                    </td>
                    </tr>
                    <tr>
                    <td><strong>Email</strong></td>
                    <td>
                      <a href={'mailto:'+item.properties.email}>{item.properties.email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Website</strong>
                    </td>
                    <td>
                      <a target={'_blank'} href={item.properties.website}>{item.properties.website}</a>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>County</strong></td>
                    <td>{item.properties.county}</td>
                  </tr>
                </tbody>
              </table>
              </div>
            </Popup>
          </CircleMarker>
        )
      }
    }
  }) : null}
  {health ? CSOs.features.map((item: any) => {
    if(item.properties.Latitude !== null && item.properties.Health === 'Yes'){
      if(county !== ' '){
        if((item.properties.county === county) || item.properties.county.includes(county)){
          return (
            <CircleMarker key={item.properties.Latitude + 'health' + item.properties.Longitude} fillColor='blue' color='blue' radius={5} center={[item.properties.Latitude, item.properties.Longitude]}>
              <Popup>
              <div style={{height: 200, overflowY: 'auto', width: '100%'}} >
                <table className='table'>
                  <tbody>
                    <tr>
                    <td><strong>Name</strong></td>
                      <td>
                      <strong>{item.properties.Organization}</strong>
                      </td>
                      </tr>
                      <tr>
                      <td><strong>Contact Person</strong></td>
                      <td>
                        {item.properties.contact}
                      </td>
                      </tr>
                      <tr>
                      <td><strong>Phone</strong></td>
                      <td>
                      <a href={'tel:+'+item.properties.phone}>{"+"+item.properties.phone}</a>
                      </td>
                      </tr>
                      <tr>
                      <td><strong>Email</strong></td>
                      <td>
                        <a href={'mailto:'+item.properties.email}>{item.properties.email}</a>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Website</strong>
                      </td>
                      <td>
                        <a target={'_blank'} href={item.properties.website}>{item.properties.website}</a>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>County</strong></td>
                      <td>{item.properties.county}</td>
                    </tr>
                  </tbody>
                </table>
                </div>
              </Popup>
            </CircleMarker>
          )
        }
      } else {
        return (
          <CircleMarker key={item.properties.Latitude + 'health' + item.properties.Longitude} fillColor='blue' color='blue' radius={5} center={[item.properties.Latitude, item.properties.Longitude]}>
            <Popup>
            <div style={{height: 200, overflowY: 'auto', width: '100%'}} >
              <table className='table'>
                <tbody>
                  <tr>
                  <td><strong>Name</strong></td>
                    <td>
                    <strong>{item.properties.Organization}</strong>
                    </td>
                    </tr>
                    <tr>
                    <td><strong>Contact Person</strong></td>
                    <td>
                      {item.properties.contact}
                    </td>
                    </tr>
                    <tr>
                    <td><strong>Phone</strong></td>
                    <td>
                    <a href={'tel:+'+item.properties.phone}>{"+"+item.properties.phone}</a>
                    </td>
                    </tr>
                    <tr>
                    <td><strong>Email</strong></td>
                    <td>
                      <a href={'mailto:'+item.properties.email}>{item.properties.email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Website</strong>
                    </td>
                    <td>
                      <a target={'_blank'} href={item.properties.website}>{item.properties.website}</a>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>County</strong></td>
                    <td>{item.properties.county}</td>
                  </tr>
                </tbody>
              </table>
              </div>
            </Popup>
          </CircleMarker>
        )
      }
    }
  }) : null}
  {education ? CSOs.features.map((item: any) => {
    if(item.properties.Latitude !== null && item.properties.Education !== null){
      if(county !== ' '){
        if((item.properties.county === county || item.properties.county.includes(county))){
          return (
            <CircleMarker key={item.properties.Latitude + 'edu' + item.properties.Longitude} fillColor='green' color='green' radius={5} center={[item.properties.Latitude, item.properties.Longitude]}>
              <Popup>
              <div style={{height: 200, overflowY: 'auto', width: '100%'}} >
                <table className='table'>
                  <tbody>
                    <tr>
                    <td><strong>Name</strong></td>
                      <td>
                      <strong>{item.properties.Organization}</strong>
                      </td>
                      </tr>
                      <tr>
                      <td><strong>Contact Person</strong></td>
                      <td>
                        {item.properties.contact}
                      </td>
                      </tr>
                      <tr>
                      <td><strong>Phone</strong></td>
                      <td>
                      <a href={'tel:+'+item.properties.phone}>{"+"+item.properties.phone}</a>
                      </td>
                      </tr>
                      <tr>
                      <td><strong>Email</strong></td>
                      <td>
                        <a href={'mailto:'+item.properties.email}>{item.properties.email}</a>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Website</strong>
                      </td>
                      <td>
                        <a target={'_blank'} href={item.properties.website}>{item.properties.website}</a>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>County</strong></td>
                      <td>{item.properties.county}</td>
                    </tr>
                  </tbody>
                </table>
                </div>
              </Popup>
            </CircleMarker>
          )
        }
      } else {
        return (
          <CircleMarker key={item.properties.Latitude + 'edu' + item.properties.Longitude} fillColor='green' color='green' radius={5} center={[item.properties.Latitude, item.properties.Longitude]}>
            <Popup>
            <div style={{height: 200, overflowY: 'auto', width: '100%'}} >
              <table className='table'>
                <tbody>
                  <tr>
                  <td><strong>Name</strong></td>
                    <td>
                    <strong>{item.properties.Organization}</strong>
                    </td>
                    </tr>
                    <tr>
                    <td><strong>Contact Person</strong></td>
                    <td>
                      {item.properties.contact}
                    </td>
                    </tr>
                    <tr>
                    <td><strong>Phone</strong></td>
                    <td>
                    <a href={'tel:+'+item.properties.phone}>{"+"+item.properties.phone}</a>
                    </td>
                    </tr>
                    <tr>
                    <td><strong>Email</strong></td>
                    <td>
                      <a href={'mailto:'+item.properties.email}>{item.properties.email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Website</strong>
                    </td>
                    <td>
                      <a target={'_blank'} href={item.properties.website}>{item.properties.website}</a>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>County</strong></td>
                    <td>{item.properties.county}</td>
                  </tr>
                </tbody>
              </table>
              </div>
            </Popup>
          </CircleMarker>
        )
      }
    }
  }) : null}
  {protection ?  CSOs.features.map((item: any) => {
    if(item.properties.Latitude !== null && item.properties.Protection !== null){
      if(county !== ' '){
        if((item.properties.county === county) || item.properties.county.includes(county)){
          return (
            <CircleMarker key={item.properties.Latitude + 'protect' + item.properties.Longitude} fillColor='#A61E4D' color='#A61E4D' radius={5} center={[item.properties.Latitude, item.properties.Longitude]}>
              <Popup>
              <div style={{height: 200, overflowY: 'auto', width: '100%'}} >
                <table className='table'>
                  <tbody>
                    <tr>
                    <td><strong>Name</strong></td>
                      <td>
                      <strong>{item.properties.Organization}</strong>
                      </td>
                      </tr>
                      <tr>
                      <td><strong>Contact Person</strong></td>
                      <td>
                        {item.properties.contact}
                      </td>
                      </tr>
                      <tr>
                      <td><strong>Phone</strong></td>
                      <td>
                      <a href={'tel:+'+item.properties.phone}>{"+"+item.properties.phone}</a>
                      </td>
                      </tr>
                      <tr>
                      <td><strong>Email</strong></td>
                      <td>
                        <a href={'mailto:'+item.properties.email}>{item.properties.email}</a>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Website</strong>
                      </td>
                      <td>
                        <a target={'_blank'} href={item.properties.website}>{item.properties.website}</a>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>County</strong></td>
                      <td>{item.properties.county}</td>
                    </tr>
                  </tbody>
                </table>
                </div>
              </Popup>
            </CircleMarker>
          )
        }
      } else {
        return (
          <CircleMarker key={item.properties.Latitude + 'protect' + item.properties.Longitude} fillColor='#A61E4D' color='#A61E4D' radius={5} center={[item.properties.Latitude, item.properties.Longitude]}>
            <Popup>
            <div style={{height: 200, overflowY: 'auto', width: '100%'}} >
              <table className='table'>
                <tbody>
                  <tr>
                  <td><strong>Name</strong></td>
                    <td>
                    <strong>{item.properties.Organization}</strong>
                    </td>
                    </tr>
                    <tr>
                    <td><strong>Contact Person</strong></td>
                    <td>
                      {item.properties.contact}
                    </td>
                    </tr>
                    <tr>
                    <td><strong>Phone</strong></td>
                    <td>
                    <a href={'tel:+'+item.properties.phone}>{"+"+item.properties.phone}</a>
                    </td>
                    </tr>
                    <tr>
                    <td><strong>Email</strong></td>
                    <td>
                      <a href={'mailto:'+item.properties.email}>{item.properties.email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Website</strong>
                    </td>
                    <td>
                      <a target={'_blank'} href={item.properties.website}>{item.properties.website}</a>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>County</strong></td>
                    <td>{item.properties.county}</td>
                  </tr>
                </tbody>
              </table>
              </div>
            </Popup>
          </CircleMarker>
        )
      }
    }
  }) : null}
  {advocacy ?  CSOs.features.map((item: any) => {
    if(item.properties.Latitude !== null && item.properties.Empowerment !== null){
      if(county !== ' '){
        if((item.properties.county === county) || item.properties.county.includes(county)){
      return (
        <CircleMarker key={item.properties.Latitude + 'emp' + item.properties.Longitude} fillColor='#E8590C' color='#E8590C' radius={5} center={[item.properties.Latitude, item.properties.Longitude]}>
          <Popup>
            <div style={{height: 200, overflowY: 'auto', width: '100%'}} >
            <table className='table'>
              <tbody>
                <tr>
                <td><strong>Name</strong></td>
                  <td>
                  <strong>{item.properties.Organization}</strong>
                  </td>
                  </tr>
                  <tr>
                  <td><strong>Contact Person</strong></td>
                  <td>
                    {item.properties.contact}
                  </td>
                  </tr>
                  <tr>
                  <td><strong>Phone</strong></td>
                  <td>
                  <a href={'tel:+'+item.properties.phone}>{"+"+item.properties.phone}</a>
                  </td>
                  </tr>
                  <tr>
                  <td><strong>Email</strong></td>
                  <td>
                    <a href={'mailto:'+item.properties.email}>{item.properties.email}</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Website</strong>
                  </td>
                  <td>
                    <a target={'_blank'} href={item.properties.website}>{item.properties.website}</a>
                  </td>
                </tr>
                <tr>
                  <td><strong>County</strong></td>
                  <td>{item.properties.county}</td>
                </tr>
              </tbody>
            </table>
            </div>
          </Popup>
        </CircleMarker>
      )
        }
      } else {
        return (
          <CircleMarker key={item.properties.Latitude + 'emp' + item.properties.Longitude} fillColor='#E8590C' color='#E8590C' radius={5} center={[item.properties.Latitude, item.properties.Longitude]}>
            <Popup>
              <div style={{height: 200, overflowY: 'auto', width: '100%'}} >
              <table className='table'>
                <tbody>
                  <tr>
                  <td><strong>Name</strong></td>
                    <td>
                      <strong>{item.properties.Organization}</strong>
                    </td>
                    </tr>
                    <tr>
                    <td><strong>Contact Person</strong></td>
                    <td>
                      {item.properties.contact}
                    </td>
                    </tr>
                    <tr>
                    <td><strong>Phone</strong></td>
                    <td>
                    <a href={'tel:+'+item.properties.phone}>{"+"+item.properties.phone}</a>
                    </td>
                    </tr>
                    <tr>
                    <td><strong>Email</strong></td>
                    <td>
                      <a href={'mailto:'+item.properties.email}>{item.properties.email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Website</strong>
                    </td>
                    <td>
                      <a target={'_blank'} href={item.properties.website}>{item.properties.website}</a>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>County</strong></td>
                    <td>{item.properties.county}</td>
                  </tr>
                </tbody>
              </table>
              </div>
            </Popup>
          </CircleMarker>
        )
      }
    }
  }) : null}
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
            Child Service Providers
          </Text>
        </Group>
        <div className={classes.collections}>{collectionLinks}</div>
        <Group className={classes.collectionsHeader} position="apart">
          <Text size="xs" weight={500} color="dimmed">
            Filter by County
          </Text>
        </Group>
        <div className={classes.collections}>
          <Select value={county} onChange={(val: any) => {setCounty(val)}}  placeholder="Filter by county" data={[
            {value: '', label: 'All'},
            {value: 'Baringo', label: 'Baringo'},
            {value: 'Kericho', label: 'Kericho'},
            {value: 'Nairobi', label: 'Nairobi'},
            {value: 'Mombasa', label: 'Mombasa'},
            {value: 'Nakuru', label: 'Nakuru'},
            {value: 'Elgeyo_Marakwet', label: 'Elgeyo Marakwet'},
            {value: 'West Pokot', label: 'West Pokot'},
            {value: 'Narok', label: 'Narok'},
            {value: 'Kajiado', label: 'Kajiado'},
            {value: 'Machakos', label: 'Machakos'},
            {value: 'Embu', label: 'Embu'},
            {value: 'Tharaka', label: 'Tharaka Nithi'},
            {value: 'Laikipia', label: 'Laikipia'},
            {value: 'Nyandarua', label: 'Nyandarua'},
            {value: 'Kitui', label: 'Kitui'},
            {value: 'Makueni', label: 'Makueni'},
            {value: 'Tana River', label: 'Tana River'},
            {value: 'Garissa', label: 'Garissa'},
            {value: 'Bomet', label: 'Bomet'},
            {value: 'Bungoma', label: 'Bungoma'},
            {value: 'Busia', label: 'Busia'},
            {value: 'Homa Bay', label: 'Homa Bay'},
            {value: 'Isiolo', label: 'Isiolo'},
            {value: 'Kakamega', label: 'Kakamega'},
            {value: 'Kiambu', label: 'Kiambu'},
            {value: 'Kilifi', label: 'Kilifi'},
            {value: 'Kirinyaga', label: 'Kirinyaga'},
            {value: 'Kisii', label: 'Kisii'},
            {value: 'Kisumu', label: 'Kisumu'},
            {value: 'Kwale', label: 'Kwale'},
            {value: 'Lamu', label: 'Lamu'},
            {value: 'Mandera', label: 'Mandera'},
            {value: 'Marsabit', label: 'Marsabit'},
            {value: 'Meru', label: 'Meru'},
            {value: 'Migori', label: 'Migori'},
            {value: "Murang'a", label: "Murang'a"},
            {value: 'Nandi', label: 'Nandi'},
            {value: 'Nyamira', label: 'Nyamira'},
            {value: 'Nyeri', label: 'Nyamira'},
            {value: 'Samburu', label: 'Samburu'},
            {value: 'Siaya', label: 'Siaya'},
            {value: 'Taita_Taveta', label: 'Taita-Taveta'},
            {value: 'Trans Nzoia', label: 'Trans Nzoia'},
            {value: 'Turkana', label: 'Turkana'},
            {value: 'Uasin Gishu', label: 'Uasin Gishu'},
            {value: 'Vihiga', label: 'Vihiga'},
            {value: 'Wajir', label: 'Wajir'},
          ]} searchable clearable allowDeselect icon={<Location size={15} />} />
        </div>
        {county !== ''? (
          <Text style={{fontSize: 10, marginLeft: 20}} >Your are viewing results for: {county}</Text>
        ) : null}
        {county !== '' ? (
          <Group direction='row' position='right'>
            <Button variant='subtle' onClick={() => {setCounty('')}} radius={'lg'}>Reset</Button>
          </Group>
        ) : null}
      </Navbar.Section>
        </Navbar>
      }
      aside={
        <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
          <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
            <Text> Quick Statistics</Text>
            <SimpleGrid cols={1} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
            <Paper withBorder radius="md" p="xs">
        <Group>
          <RingProgress
            size={80}
            roundCaps
            thickness={8}
            sections={[{ value: Math.floor((healtht / total) * 100), color: 'blue' }]}
            label={
              <Center>
                <ArrowUpRight size={22} />
              </Center>
            }
          />

          <div>
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              Health
            </Text>
            <Text weight={700} size="xl">
              {healtht}
            </Text>
          </div>
        </Group>
      </Paper>
      <Paper withBorder radius="md" p="xs">
        <Group>
          <RingProgress
            size={80}
            roundCaps
            thickness={8}
            sections={[{ value: Math.floor((educationt / total) * 100), color: 'green' }]}
            label={
              <Center>
                <ArrowUpRight size={22} />
              </Center>
            }
          />

          <div>
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              Education
            </Text>
            <Text weight={700} size="xl">
              {educationt}
            </Text>
          </div>
        </Group>
      </Paper>
      <Paper withBorder radius="md" p="xs">
        <Group>
          <RingProgress
            size={80}
            roundCaps
            thickness={8}
            sections={[{ value: Math.floor((protectiont / total) * 100), color: '#A61E4D' }]}
            label={
              <Center>
                <ArrowUpRight size={22} />
              </Center>
            }
          />

          <div>
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              Protection
            </Text>
            <Text weight={700} size="xl">
              {protectiont}
            </Text>
          </div>
        </Group>
      </Paper>

      <Paper withBorder radius="md" p="xs">
        <Group>
          <RingProgress
            size={80}
            roundCaps
            thickness={8}
            sections={[{ value: Math.floor((empowermentt / total) * 100), color: '#E8590C' }]}
            label={
              <Center>
                <ArrowUpRight size={22} />
              </Center>
            }
          />

          <div>
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
            Advocacy
            </Text>
            <Text weight={700} size="xl">
              {empowermentt}
            </Text>
          </div>
        </Group>
      </Paper>
            </SimpleGrid>
          </Aside>
        </MediaQuery>
      }
      header={
        <Header height={56} className={classes.header}>
          <div className={classes.inner}>
            <Group style={{marginTop: 10}} >
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <p >Child Service Providers</p>
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
