export function instruction(
    direction: string, 
    locationName: string = ""
)  
{
    switch(direction) {
    case "start":
        return "Bắt đầu"
    case "straight":
        return `Đi thẳng trên ${locationName}`
    case "left":
        return `Rẽ trái vào ${locationName}`
    case "right":
        return `Rẽ phải vào ${locationName}`
    case "u turn left":
        return `Quay đầu bên trái vào ${locationName}`
    case "u turn right":
        return `Quay đầu bên phải vào ${locationName}`
    case "end":
        return "Kết thúc"
    default:
        break;
    }
}