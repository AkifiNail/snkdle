import { useEffect , useState } from "react"
import Input from './input'

export default function Fetch() {


    const [data , setData] = useState([])
    const [value , setValue] = useState('')   
    const [randomCharacter, setRandomCharacter] = useState(null);  
    const [isloaded , setIsloaded] = useState(false)

    const [attempt , setAttempt] = useState(0)
    const [ChoseCharacter , setChoseCharacter] = useState([])

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await fetch('./src/assets/data.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const jsonData = await response.json();
                setData(jsonData.characters || []); 
                setIsloaded(true);
            } catch (err) {
                console.error(err);
                setError('Failed to load data');
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
            if (data.length > 0) { 
                const randomIndex = Math.floor(Math.random() * data.length);
                setRandomCharacter(data[randomIndex]);
            }else{
                console.log("no data")
            }
    } , [data])

    function CheckIfTrue(data) {
        setChoseCharacter((prev) => [...prev, data]);
        setAttempt(attempt + 1);
        if (randomCharacter && data.id === randomCharacter.id) {
            console.log("L'ID correspond !");
            console.log(data.Season , randomCharacter.Season)
        }
        if (randomCharacter && data.Attribut === randomCharacter.Attribut) {
            console.log("L'attribut correspond !");
        } 
        if (randomCharacter && data.Genre === randomCharacter.Genre) {
            console.log("Le genre correspond !");
        }
        if (randomCharacter && data.Life === randomCharacter.Life) {
            console.log("La vie (Life) correspond !");
        }
        if (randomCharacter &&  parseInt(data.Season) > parseInt(randomCharacter.Season)) {
            console.log("La saison est plus grande !");
        }else if (randomCharacter &&  parseInt(data.Season) < parseInt(randomCharacter.Season)) {
            console.log("La saison est plus petite !");
        }else if (randomCharacter &&  parseInt(data.Season) === parseInt(randomCharacter.Season)) {
            console.log("La saison est égale !");
        }
        if (randomCharacter && data.Lieu === randomCharacter.Lieu) {
            console.log("Le lieu correspond !");
        }
        if (randomCharacter && (
            data.id !== randomCharacter.id &&
            data.Attribut !== randomCharacter.Attribut &&
            data.Genre !== randomCharacter.Genre &&
            data.Life !== randomCharacter.Life &&
            data.season !== randomCharacter.season &&
            data.Lieu !== randomCharacter.Lieu
        )) {
            console.log("Aucune correspondance !");
        }
    }
    
    const filteredData = data.filter(data => data.Name.toLowerCase().includes(value.toLowerCase()))


    return (
        <>
        <Input value={value} onChange={setValue} placeholder='search' />
        <ul> {filteredData.map(data => {
           return <button onClick={() => CheckIfTrue(data)} key={data.id}>{data.Name}</button>
        }) }</ul>
        {randomCharacter && (
                <p>Random Character: {randomCharacter.Name}</p>
            )}

            <p>Essai : {attempt}</p>

            {Array.isArray(ChoseCharacter) && ChoseCharacter.map((data) => {
                return (
                    <div key={data.id} className="d-flex gap-3">
                        <p>{data.Name}</p>
                        <p>Saison {data.Season}</p>
                        <p>{data.Attribut}</p>
                        <p>{data.Genre}</p>
                        {data.Life ? <p>Vivant</p> : <p>Mort</p>}
                        <p>{data.Lieu}</p>
                    </div>
                )
            })}
        </>

        
    )
}
