terraform {
  required_providers {
    azuread = {
      source  = "hashicorp/azuread"
      version = "2.47.0"
    }

    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.88.0"
    }
  }

  cloud {
    organization = "toastboy"

    workspaces {
      name = "next-www-toastboy"
    }
  }
}

provider "azuread" {
  tenant_id = "6a192374-f4a3-4ab8-bcaf-7053c1f64ce9"
}

provider "azurerm" {
  tenant_id       = "6a192374-f4a3-4ab8-bcaf-7053c1f64ce9"
  subscription_id = "164b8c25-f844-4838-82c4-32d17635dcf0"

  features {}
}

data "azuread_client_config" "current" {}

resource "azuread_application" "next_www_toastboy_db_seed" {
  display_name = "Next www toastboy db seed"
}

resource "azuread_service_principal" "next_www_toastboy_db_seed" {
  client_id                    = azuread_application.next_www_toastboy_db_seed.client_id
  app_role_assignment_required = false
}

module "db-seed" {
  source = "./modules/azure-blob-storage"

  container_name              = "dbseeddata"
  service_principal_object_id = azuread_application.next_www_toastboy_db_seed.object_id

  tags = {
    Terraform = "true"
  }
}
