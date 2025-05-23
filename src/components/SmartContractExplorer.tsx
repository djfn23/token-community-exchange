
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { blockchain } from "@/services/blockchain";
import { useMoralis } from "@/contexts/MoralisContext";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const SmartContractExplorer = () => {
  const [contractAddress, setContractAddress] = useState("");
  const [abiJson, setAbiJson] = useState("");
  const [functionName, setFunctionName] = useState("");
  const [paramValue, setParamValue] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [contractFunctions, setContractFunctions] = useState<any[]>([]);
  
  const moralis = useMoralis();
  
  const handleAbiChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAbiJson(e.target.value);
    try {
      const abi = JSON.parse(e.target.value);
      const functions = abi.filter((item: any) => 
        item.type === "function" && 
        (item.stateMutability === "view" || item.stateMutability === "pure")
      );
      setContractFunctions(functions);
      if (functions.length > 0 && !functionName) {
        setFunctionName(functions[0].name);
      }
    } catch (error) {
      console.error("Invalid ABI JSON:", error);
      setContractFunctions([]);
    }
  };

  const executeFunction = async () => {
    if (!contractAddress || !functionName || !abiJson) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const abi = JSON.parse(abiJson);
      const params = paramValue ? { [functionName]: paramValue } : {};
      
      const response = await blockchain.executeContractFunction(
        contractAddress,
        functionName,
        abi,
        params
      );
      
      setResult(response);
      toast({
        title: "Fonction exécutée",
        description: "La fonction du contrat a été exécutée avec succès",
      });
    } catch (error) {
      console.error("Error executing function:", error);
      toast({
        title: "Erreur d'exécution",
        description: "Impossible d'exécuter la fonction du contrat",
        variant: "destructive",
      });
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const selectFunction = (funcName: string) => {
    setFunctionName(funcName);
    setParamValue("");
    setResult(null);
  };
  
  if (!moralis.isAuthenticated) {
    return (
      <Card className="token-card">
        <CardHeader>
          <CardTitle className="text-lg">Explorateur de contrats intelligents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-6 text-center text-muted-foreground">
            Connectez votre wallet pour interagir avec des contrats intelligents
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="token-card">
      <CardHeader>
        <CardTitle className="text-lg">Explorateur de contrats intelligents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="contractAddress">Adresse du contrat</Label>
            <Input
              id="contractAddress"
              placeholder="0x..."
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="abiJson">ABI du contrat (JSON)</Label>
            <Textarea
              id="abiJson"
              placeholder='[{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]'
              value={abiJson}
              onChange={handleAbiChange}
              className="h-24"
            />
          </div>
          
          {contractFunctions.length > 0 && (
            <div className="border border-token-muted/20 rounded-md p-3">
              <Label className="mb-2 block">Fonctions disponibles</Label>
              <div className="flex flex-wrap gap-2">
                {contractFunctions.map((func) => (
                  <Button
                    key={func.name}
                    variant={functionName === func.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => selectFunction(func.name)}
                  >
                    {func.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {functionName && (
            <div>
              <Label htmlFor="paramValue">Paramètre (optionnel)</Label>
              <Input
                id="paramValue"
                placeholder="Valeur du paramètre"
                value={paramValue}
                onChange={(e) => setParamValue(e.target.value)}
              />
            </div>
          )}
          
          <Button 
            onClick={executeFunction} 
            disabled={isLoading || !contractAddress || !functionName || !abiJson}
            className="w-full"
          >
            {isLoading ? "Exécution..." : "Exécuter la fonction"}
          </Button>
          
          {result !== null && (
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
              <Label className="mb-2 block">Résultat</Label>
              <pre className="text-xs overflow-x-auto">
                {typeof result === "object" 
                  ? JSON.stringify(result, null, 2) 
                  : String(result)
                }
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartContractExplorer;
