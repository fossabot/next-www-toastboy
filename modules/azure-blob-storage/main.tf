resource "azurerm_resource_group" "this" {
  name     = var.resource_group_name
  location = var.location

  tags = var.tags
}

resource "azurerm_storage_account" "this" {
  name                     = var.storage_account_name
  resource_group_name      = azurerm_resource_group.this.name
  location                 = azurerm_resource_group.this.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  network_rules {
    default_action = "Deny"
    ip_rules       = ["82.68.10.159"]
  }

  blob_properties {
    versioning_enabled = true
  }

  tags = var.tags
}

resource "azurerm_storage_container" "this" {
  name                  = var.container_name
  storage_account_name  = azurerm_storage_account.this.name
  container_access_type = "private"
}
