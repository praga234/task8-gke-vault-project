resource "google_container_cluster" "primary" {
  name     = var.cluster_name
  location = var.region

  deletion_protection      = false
  remove_default_node_pool = false
  initial_node_count       = 1
}

resource "google_container_node_pool" "primary_nodes" {
  name       = "primary-node-pool"
  location   = var.region
  cluster    = google_container_cluster.primary.name
  node_count = var.node_count

  node_config {
    machine_type = "e2-medium"
  }
}