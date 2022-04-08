$config=Get-Content azure.json | ConvertFrom-Json

function DeployAzureObject() {
    param(
        $resourceGroupIndex,
        $objectIndex
    )
    $objectType=$config.azure.resourceGroups[$resourceGroupIndex].objects[$objectIndex].objectType
    $rg=$config.azure.resourceGroups[$resourceGroupIndex].name
    "Setting up an Azure object of type '$objectType' in resource group '$rg'"
 
    $retval=az group show -n $config.azure.resourceGroups[$resourceGroupIndex].name 2> $null
    if ( -not $retval) {
        "Creating resource group '$rg'"
        az group create --name $rg --location $config.azure.resourceGroups[$resourceGroupIndex].location
        if( -not $? ) {
            "Unable to set up resource group"
            exit
        }
    }
 
    $name=$config.azure.resourceGroups[$resourceGroupIndex].objects[$objectIndex].name
    $location=$config.azure.resourceGroups[$resourceGroupIndex].location
    switch( $objectType) {
        acr {
            $retval=az acr show -g $rg --name $name  2> $null
            if ( -not $retval ) {
                "Creating the Azure Container Registry '$name'"
                az acr create --name $name -g $rg --sku $config.azure.resourceGroups[$resourceGroupIndex].objects[$objectIndex].sku
                if( -not $? ) { 
                    "Could not create ACR"
                    exit 
                }
            } else {
                "Azure Container Registry already created"
            }
            $id=az acr show --name $name -g $rg --query id |ConvertFrom-Json
            if( -not $? ) { 
                "Could not find ACR"
                exit 
            }
        }
        keyvault {
            $retval=az keyvault show -g $rg -n $name 2> $null
            if ( -not $retval ) {
                "Creating the Azure Key Vault '$name'"
                az keyvault create -n $name -g $rg -l $location
                if( -not $? ) { 
                    "Could not create Azure Keyvault"
                    exit 
                }
            } else {
                "Azure Key Vault already created"
            }
            $id=az keyvault show -n $name -g $rg --output json --query id |ConvertFrom-Json
            if( -not $? ) { 
                "Could not find Azure Keyvault"
                exit 
            }
        }   
        default {
            "Unknown object type: '$objectType'"
            exit
        }

    }
    $config.azure.resourceGroups[$resourceGroupIndex].objects[$objectIndex].id=$id
    "Object has ID '$($config.azure.resourceGroups[$resourceGroupIndex].objects[$objectIndex].id)'"    
}


az login > $null
if( -not $? ) {
    "Error logging in"
    exit
}

"------------------------------------------------------------------"
"Successfully logged in"


az account set --subscription $config.azure.subscription
if( -not $? ) {
    "Error setting subscription"
    exit
}

"------------------------------------------------------------------"
"Subscription set to $($config.azure.subscription)"

for($rgIndex=0; $rgIndex -lt ($config.azure.resourceGroups.Length); ++$rgIndex ) {
    "Setting up the objects of resource group $($config.azure.resourceGroups[$rgIndex].name)"
    for($oIndex=0; $oIndex -lt ($config.azure.resourceGroups[$rgIndex].objects.Length); ++$oIndex) {
        "------------------------------------------------------------------"
        DeployAzureObject -resourceGroupIndex $rgIndex -objectIndex $oIndex
    }

}
