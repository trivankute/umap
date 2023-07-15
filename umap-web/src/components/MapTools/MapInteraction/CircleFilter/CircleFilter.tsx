import { Circle } from "react-leaflet"
import { icon } from "./CustomMarker"
import InformationMarker from "../InformationMarker/InformationMarker"


interface CircleFilterProps {
    mapRef: any,
    addressList: any,
    fetchingFilter: any,
    mainMarker: any
}


export function returnRightIconByType(type: string) {
    switch (type) {
        case "place_of_worship":
            return "fa-church";
        case "school":
            return "fa-school";
        case "bar":
            return "fa-wine-glass";
        case "restaurant":
            return "fa-utensils";
        case "hospital":
            return "fa-hospital";
        case "bank":
            return "fa-university";
        case "atm":
            return "fa-money-bill-wave";
        case "hotel":
            return "fa-hotel";
        case "pharmacy":
            return "fa-clinic-medical";
        case "gas_station":
            return "fa-gas-pump";
        case "park":
            return "fa-tree";
        case "supermarket":
            return "fa-shopping-cart";
        case "shopping_mall":
            return "fa-shopping-bag";
        case "airport":
            return "fa-plane";
        case "bus_station":
            return "fa-bus";
        case "train_station":
            return "fa-train";
        case "taxi_stand":
            return "fa-taxi";
        case "marketplace":
            return "fa-store";
        case "hairdresser":
            return "fa-cut";
        case "clothes":
            return "fa-tshirt";
        case "convenience":
            return "fa-store-alt";
        case "cafe":
            return "fa-coffee";
        case "secondary":
            return "fa-school";
        case "motorcycle":
            return "fa-motorcycle";
        case "kindergarten":
            return "fa-baby";
        case "dentist":
            return "fa-tooth";
        case "doctor":
            return "fa-user-md";
        case "computer":
            return "fa-laptop";
        case "service":
            return "fa-tools";
        case "residential":
            return "fa-home";
        case "yes":
            return "fa-building";
        case "photo":
            return "fa-camera";
        case "car_repair":
            return "fa-car";
        case "social_facility":
            return "fa-users";
        case "fast_food":
            return "fa-hamburger";
        case "car_wash":
            return "fa-car";
        case "cinema":
            return "fa-film";
        case "mobile_phone":
            return "fa-mobile-alt";
        case "library":
            return "fa-book";
        case "police":
            return "fa-balance-scale";
        case "fire_station":
            return "fa-fire-extinguisher";
        case "post_office":
            return "fa-mail-bulk";
        case "roof":
            return "fa-gas-pump";

        default:
            return "fa-home";
    }
}

export default function CircleFilter(props: CircleFilterProps) {
    return (
        <>
            {props.fetchingFilter ?
                <Circle
                    center={{ lat: props.mainMarker[0], lng: props.mainMarker[1] }}
                    pathOptions={{ color: 'red' }}
                    radius={props.fetchingFilter} />
                :
                props.addressList.map((address: any, index: number) =>
                    <InformationMarker key={index} position={[address.lat, address.lng]}
                        text={address.address}
                        type={address.type}
                        faForIcon={returnRightIconByType(address.type)}
                        mainMarkerPos={{ lat: props.mainMarker[0], lng: props.mainMarker[1] }}
                    //icon={icon}
                    />
                )

            }
        </>
    )
}